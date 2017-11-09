var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Ques = require("../models/questions");
var Quiz = require('../models/Quiz');

router.get('/', isAuthenticated, function(req, res){

});

router.get('/getquestions', function(req, res, next){
    // var nskip = req.user.nskip || 0;
    var nskip;
    if(req.user){
        nskip = req.user.nskip;
    }else{
        nskip = 0
    }
    var limit = 2;
    Ques.getques(nskip, limit, function(err, ques){
        if(err) throw err;
        console.log("Ques getqeus called");
        console.log(ques);
        res.send(ques);
    });
});

router.post('/addadmin', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var usertype = "admin";
	
	req.checkBody('username', 'username field is required').notEmpty();
	req.checkBody('password', 'password field is required').notEmpty();
	req.checkBody('password2', 'confirm password field is required').notEmpty();

    User.getUserByUsername(username, function(err, user){
        console.log("username check called");
        if(err) throw err;
        if(user){
            console.log("user found");
            res.end("this username already exists");
        }else{

        

            var errors = req.validationErrors();

            if(errors){
                req.flash('error', 'there was some error with the signup process');
                console.log(errors);
                res.send('there was some validation error');
            }else{
                var newUser = new User({	
                    username: username,
                    password:password,
                    usertype:usertype
                });


                User.createUser(newUser, function(err, user){
                    if (err) throw err;
                    console.log(user);
                    res.send('admin was created');
                });
            }
        }
    });

});

router.post('/addques', function(req, res, next){
    var ques = req.body.question;
    var op1 = req.body.option1;
    var op2 = req.body.option2;
    var op3 = req.body.option3;
    var op4 = req.body.option4;
    var ans = req.body.ans;

    req.checkBody('ques', 'ques should not be empty').notEmpty();
    req.checkBody('op1', 'op1 should not be empty').notEmpty();
    req.checkBody('op2', 'op2 should not be empty').notEmpty();
    req.checkBody('op3', 'op3 should not be empty').notEmpty();
    req.checkBody('op4', 'op4 should not be empty').notEmpty();
    req.checkBody('ans', 'ans should not be empty').notEmpty();

    var newQues =new Ques ({
        ques:ques,
        op1:op1,
        op2:op2,
        op3:op3,
        op4:op4,
        ans:ans
    });

    Ques.addques(newQues, function(err, ques){
        if(err) throw err;
        res.send('the ques was added to db' + ques);
    });

});

router.post('/addquiz', function(req, res, next){
    var quizname = req.body.quizname;
    var duration = req.body.duration;
    var active = req.body.active;

    req.checkBody('quizname',' Quizname cannot be empty').notEmpty();
    
    var newQuiz = new Quiz({
        quizname: quizname,
        duration: duration,
        active: active
    });
    console.log(newQuiz);
    console.log("addquiz functoin is called");
    Quiz.addQuiz(newQuiz, function(err, quiz){
        if(err) {return res.send("the quiz cannot be added")};
        console.log(quiz);
        console.log("res is ready to be sent");
        res.send(quiz);
    })
});

router.delete('/delete/:id', isAuthenticated, function(req, res, next){
    var id = req.params.id;
    Ques.delques(id, function(err){
        if(err){
            throw err;
        }

        res.send('Ques deleted successfully');
    });
});



function  isAuthenticated(req, res, next){
    if(req.isAuthenticated && req.user.usertype == "admin"){
        return next();
    }
    res.send(false);
}

module.exports = router;