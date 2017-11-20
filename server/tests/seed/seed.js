const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: "rat112@cat.com",
    password: "userone",
    tokens: [
        {
            access: "auth",
            token: jwt.sign({_id: userOneId, access: "auth"}, "abc123").toString()
        }
    ]
}, {
    _id: userTwoId,
    email: "cat112@rat.com",
    password: "usertwo"
}];

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

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
     let userOne = new User(users[0]).save();
     let userTwo = new User(users[1]).save();

     return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users,   populateUsers};