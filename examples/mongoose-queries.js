const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = "5a01b9bb3865d184013cea13";

if(!ObjectId.isValid(id)) {
    console.log("invalid object id");
}

/*
Todo.find({
    _id: id
}).then((todos) => {
    console.log("Todos: ", todos);
});

Todo.findOne({
   completed: false
}).then((todo) => {
    console.log("Todo: ", todo);
});
*/

/*
Todo.findById(id).then((todo) => {
    if(!todo) {
      return  console.log("id not found");
    }
   console.log("Todo by id: ", todo);
}).catch((error) => console.log(error));*/

User.findById(id).then((user) => {
    if(!user) {
        return console.log("user not found");
    }
    console.log("User found: ", user);
}, (error) => {
    console.log(error);
});