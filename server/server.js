require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const {ObjectId} = require('mongodb');

let app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(400).send("can't delete: invalid id");
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send("can' delete: no todo with this id");
        }
        return res.status(200).send({todo});
    }).catch((error) => {
        res.status(404).send("error", error)
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    /*let body = {};
    if (req.body.text) {
        body.text = req.body.text;
    }
    if (req.body.completed) {
        body.completed = req.body.completed;
    }
*/

    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)) {
        return res.status(404).send("invalid id");
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null; //set a value to null to remove it from the database
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send("todo not found");
        }

        res.send({todo});
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
        //res.status(200).send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((error) => {
        res.status(404).send(error);
    });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.listen(port, () => {
    console.log("node api started at ", port);
});

module.exports = {app};