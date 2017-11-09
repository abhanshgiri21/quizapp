var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizapp');
var db = mongoose.connection;

var QuizSchema = mongoose.Schema({
    quizname:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    active:{
        type:Boolean,
        default:false
    }
});

var Quiz = module.exports = mongoose.model('Quiz', QuizSchema);

module.exports.addQuiz = function(newQuiz, callback){
    newQuiz.save(newQuiz, function(err, quiz){
        if(err){throw err};
        console.log("quiz save called");
        console.log(quiz);
        return callback(null, quiz);
    });
}

module.exports.getActiveQuizzes = function(callback){
    Quiz.find({}, {}, callback);
}