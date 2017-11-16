const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    {_id: new ObjectId(),
        text: "one"
    },
    {_id: new ObjectId(),
        text: "two",
        completed: true,
        completedAt: 69
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        let text = "test todo";
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(error => done(error));
            });
    });

    it("should not create todo with invalid data", (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(error => done(error));
            });
    });
});


describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe("GET /todos/:id", () => {
    it("should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 400 for non-object id", (done) => {
        request(app)
            .get('/todos/ad23')
            .expect(400)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo", (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {

                    expect(todo).toNotExist();
                    done();
                }).catch(error => done(error));
            })
    });

    it("should return 404 if todo is not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if object id is invalid", (done) => {
        request(app)
            .get('/todos/ad23')
            .expect(400)
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {
    it("should update the todo", (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text: "changed first todo", completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("changed first todo");
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })

            .end(done);

    });

    it("should clear completedAt when todo is not completed", (done) => {
        let id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text: "changed second todo", completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("changed second todo");
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    })
});