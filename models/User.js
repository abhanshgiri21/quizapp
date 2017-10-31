var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizapp');
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true,
        bcrypt:true
    }
});

module.exports.getUserByUsername = function(username, callback){
    User.findOne({username:username}, callback);
}
module.exports.checkPassword = function(pass, callback){
    callback(null, true);
}
var User = module.exports = mongoose.model('User',UserSchema);