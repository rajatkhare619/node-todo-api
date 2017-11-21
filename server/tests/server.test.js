const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});

describe("POST /users", () => {
    it("should create a user", (done) => {
        let email = "ex@ex.com", password = "123456";
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
                    .catch((error) => done(error));
            });
    });

    it("should return validation errors if request is invalid", (done) => {
        request(app)
            .post('/users')
            .send({
                email: "rat",
                password: 432
            })
            .expect(404)
            .end(done);
    });

    it("should not create a user if email is already in use", (done) => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: 12334543})
            .expect(404)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((error) => done(error));
            })
    });

    it("should reject invalid login", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: "rat" //any wrong password
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => done(error))
            });
    });
});

describe("DELTE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            });
    });
});