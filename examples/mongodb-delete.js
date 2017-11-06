//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log("Unable to connect to the MongoDB server.", error);
    }
    console.log("Conencted to the MongoDB server");

  /* db.collection('Todos').deleteMany({text: "eat"}).then((result) => {
       console.log(result);
   });
*/

 /* db.collection('Todos').deleteOne({text: "eat"}).then((result) => {
      console.log(result);
  });*/
/*
 db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
     console.log(result);
 });*/

/*db.collection('Users').deleteMany({name: "Rajat"}).then((result) => {
    console.log(result);
});*/

db.collection('Users').findOneAndDelete({_id: new ObjectID("59febc9c64f8d65380451e2c")}).then((result) => {
    console.log(result);
});

   // db.close();
});