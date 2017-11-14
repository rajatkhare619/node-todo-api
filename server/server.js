const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const {ObjectId} = require('mongodb');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.status(400).send("invalid id");
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send("no todo");
        }
        return res.status(200).send({todo});
    }, (error) => {
        res.status(404).send("error");
    });

});

app.listen(port, () => {
    console.log("node api started at ", port);
});

module.exports = {app};