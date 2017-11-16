var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Ques = require("../models/questions");
var Quiz = require('../models/Quiz');
var Cat = require('../models/Category.js');
var Branch = require('../models/branches');

router.get('/', isAuthenticated, function(req, res){
    res.render('admin');
});

router.get('/viewques', function(req, res, next){
    Cat.getCat(function(err, cat){
        if(err){throw err};
        res.render('viewquesform', {cats: cat});
    })
    
});

router.get('/viewques/:cat', function(req, res, next){
    var cat = req.params.cat;
    console.log(cat);
    Ques.getQuesByCat(cat, function(err, ques){
        if(err){throw err};
        console.log(ques);
        res.render('adminque', {ques:ques})
    });
})

router.get('/addadmin', function(req, res, next){
    res.render('addadmin');
})

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
                    //res.send('admin was created');
                    res.redirect('/admin')
                });
            }
        }
    });

});

router.get('/addques', function(req, res, next){
    Cat.getCat(function(err, cats){
        console.log(cats);
        res.render('addques', {cats:cats});
    })
    
});

router.post('/addques', function(req, res, next){
    var ques = req.body.ques;
    var op1 = req.body.op1;
    var op2 = req.body.op2;
    var op3 = req.body.op3;
    var op4 = req.body.op4;
    var ans = req.body.ans;
    var cat = req.body.cat;

    var newQues =new Ques ({
        ques:ques,
        op1:op1,
        op2:op2,
        op3:op3,
        op4:op4,
        ans:ans,
        cat:cat
    });
    console.log(newQues);


    req.checkBody('ques', 'ques should not be empty').notEmpty();
    req.checkBody('op1', 'op1 should not be empty').notEmpty();
    req.checkBody('op2', 'op2 should not be empty').notEmpty();
    req.checkBody('op3', 'op3 should not be empty').notEmpty();
    req.checkBody('op4', 'op4 should not be empty').notEmpty();
    req.checkBody('ans', 'answer should not be empty').notEmpty();
    req.checkBody('cat', 'category should not be empty').notEmpty();


    var errors = req.validationErrors();
    console.log(newQues);
    console.log(errors);
    if(errors){
        res.render('addques', {ques:newQues});
    }else{
        Ques.addques(newQues, function(err, ques){
            if(err) throw err;
            //res.send('the ques was added to db' + ques);
        });
        res.redirect('/admin');
    }    

});

router.get('/addcat', function(req, res, next){
    res.render('addcategory');
});

router.post('/addcat', function(req, res, next){
    var cat = req.body.cat;

    req.checkBody('cat', 'cat should not be empty').notEmpty();
    
    var newCat =new Cat ({
        cat:cat
    });

    var errors = req.validationErrors();
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(newCat);
    console.log(errors);
    if(errors){
        res.render('addcat', {cat:newCat});
    }else{
        Cat.addCat(newCat, function(err, cat){
            if(err) throw err;
            //res.send('the ques was added to db' + ques);
        });
        res.redirect('/admin');
    }    

});

router.get('/addquiz', function(req, res, next){
    Cat.getCat(function(err, cats){
        if(err) {throw err};
        Quiz.getActiveQuizzes(function(err, quizzes){
            res.render('addquiz', {
                cats : cats,
                quizzes : quizzes
            });
        })
        
    });
});

router.get('/addquiz/:quizname', function(req, res, next){
    var quizname = req.params.quizname;

    Ques.getQuesByCat(quizname, function(err, ques){
        if(err){throw err};
        res.render('viewquiz', {
            ques:ques,
            topic:quizname
        });
    });
});

router.post('/addquiz', function(req, res, next){
    var quizname = req.body.quizname;
    var duration = req.body.duration || 30;
    var active = true;

    req.checkBody('quizname',' Quizname cannot be empty').notEmpty();
    
    var newQuiz = new Quiz({
        quizname: quizname,
        duration: duration
    });
    console.log(newQuiz);
    console.log("addquiz functoin is called");
    Quiz.addQuiz(newQuiz, function(err, quiz){
        if(err) {return res.send("the quiz cannot be added")};
        console.log(quiz);
        console.log("res is ready to be sent");
        res.redirect('/admin/addquiz')
    })
});

router.delete('/delete/:id', function(req, res, next){
    var id = req.params.id;
    Ques.delques(id, function(err){
        if(err){
            throw err;
        }

        res.send('Ques deleted successfully');
    });
});

router.delete('/deletequiz/:id', function(req, res, next){
    var id = req.params.id;
    Quiz.delquiz(id, function(err){
        if(err){
            throw err;
        }
        res.send('Ques deleted successfully');
    });
});

router.get('/viewscores', function(req, res, next){
    Branch.getBranch(function(err, branches){
        console.log(branches);
        res.render('adminresult', {branches:branches});
    });
})

router.get('/viewscores/:branch', function(req, res, next){
    var branch = req.params.branch;
    User.findResultByBranch(branch, function(err, results){
        if(err){throw err};
        res.render('adminresult',{
            results:results
        })
    })
})

router.get('/addbranch', function(req, res, next){
    Branch.getBranch(function(err, branches){
        res.render('addbranch', {branches: branches});
    })
})

router.post('/addbranch', function(req, res, next){
    var branch = req.body.branch;
    
    req.checkBody('branch', 'branch should not be empty').notEmpty();
    
    var newBranch =new Branch ({
        branch:branch
    });

    var errors = req.validationErrors();
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(newBranch);
    console.log(errors);
    if(errors){
        res.render('addbranch', {branch:newBranch});
    }else{
        Branch.addBranch(newBranch, function(err, branch){
            if(err) throw err;
            //res.send('the ques was added to db' + ques);
        });
        res.redirect('/admin');
    }  
})


function  isAuthenticated(req, res, next){
    if(!req.user){
        res.redirect('/');
    }
    if(req.isAuthenticated && req.user.usertype == "admin"){
        return next();
    }
    res.redirect('/');
}

module.exports = router;