var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizapp');
var db = mongoose.connection;

var User = {};

User.getUserByUsername = function(username, callback){
    callback(null, true);
}
User.checkPassword = function(pass, callback){
    callback(null, true);
}
module.exports = User;