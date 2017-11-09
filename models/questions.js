var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizapp');
var db = mongoose.connection;

var QuestionSchema = mongoose.Schema({
    ques:{
        type:String,
        required: true
    },
    op1:{
        type:String,
        required:true
    },
    op2:{
        type:String,
        required:true
    },
    op3:{
        type:String,
        required:true
    },
    op4:{
        type:String,
        required:true
    },
    ans:{
        type:String,
        required:true
    }
});

var Ques = module.exports = mongoose.model('Ques', QuestionSchema);


module.exports.addques = function(quesObj, callback){
    quesObj.save(quesObj, callback);
}

module.exports.getques = function(nskip, limit, callback){
    console.log("getques caled");
    cursor =  Ques.find().skip(nskip).limit(limit);
    return cursor.exec(callback);
}

module.exports.delques = function(id, callback){
    Ques.findByIdAndRemove(id, callback);   
}
