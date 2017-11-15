const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp'); //Local
mongoose.connect('mongodb://heroku:123@ds259325.mlab.com:59325/herokuapp'); //Online

module.exports = {
    mongoose
};