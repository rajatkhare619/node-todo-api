//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to the MongoDB server.", error);
    }
    console.log("Conencted to the MongoDB server");

    /*db.collection('Todos').find({_id: new ObjectID("59ff0e90f8fcc4f8c5391bb2")}).toArray().then((docs) => {
        console.log("Todos: ");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (error) => {
        console.log("Can't fetch todos", error);
    });*/

   /* db.collection('Todos').find().count().then((count) => {
        console.log("Todos count: ", count);

    }, (error) => {
        console.log("Can't fetch todos", error);
    });*/

   db.collection('Users').find({age: 25}).toArray().then((docs) => {
       console.log("Todos: ");
       console.log(JSON.stringify(docs, undefined, 2));
   }, (error) => {
       console.log("error occurred: ", error);
   });
    db.close();
});