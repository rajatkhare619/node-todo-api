const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*Todo.remove({}).then((result) => {
    console.log(result);
});*/

Todo.findOneAndRemove({_id: "5a0b186fecbade1e250a3b94"}).then((todo) => {

});

Todo.findByIdAndRemove('5a0b186fecbade1e250a3b94').then((todo) => {
console.log("Todo: ", todo);
});