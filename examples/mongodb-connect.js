//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();
console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to the MongoDB server.", error);
    }
    console.log("Conencted to the MongoDB server");
/*
    db.collection('Todos').insertOne({
        text: "established connection",
        completed: false
    }, (error, result) => {
        if (error) {
            return console.log("Unable to insert todo", error);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: "Rajat",
        age: 25,
        location: "India"
    }, (error, result) => {
        if (error) {
            return console.log("Unable to insert user", error);
        }
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });*/
    db.close();
});