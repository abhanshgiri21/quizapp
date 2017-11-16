var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizapp');
var db = mongoose.connection;
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true,
        bcrypt:true
    },
    usertype:{
        type:String,
        required:true
    },
    branch:{
        type:String
    },
    scores:[{
        date:{
            type:Date
        },
        subject:{
            type:String
        },
        score:{
            type:String
        }
    }]
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserByUsername = function(username, callback){
    User.findOne({username:username}, callback);
}
module.exports.comparePassword = function(password, candidatePassword, callback){
    bcrypt.compare(candidatePassword, password, function(err, isMatch){
        if(err) return callback(err, false);
        console.log(isMatch);
        return callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback){
    User.findById({_id:id}, callback);
}

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;
        newUser.password = hash;
        newUser.save(newUser, callback);
    });

};

module.exports.findResultByBranch = function(branch, callback){
    User.find({branch:branch}, callback);
}

module.exports.insertscores = function(id, newScore, callback){
    User.findOneAndUpdate({_id : id}, {$push : {'scores' : newScore}}, {safe:true, upsert:true}, callback);
}