var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Quiz = require('../models/Quiz');
var Ques = require('../models/questions');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
	Quiz.getActiveQuizzes(function(err, quizzes){
		if(err){throw err};
		res.render('user', {
			user: req.user,
			quizzes:quizzes
		});
	});
});


passport.serializeUser(function(user, done) {
    console.log('user serialized');
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});



passport.use(new LocalStrategy(
    function (username, password, done) {
		//console.log("local starrategy vcalloed");
        User.getUserByUsername( username, function (err, user) {
			console.log("username  called");
			if(err) return done(err);
			console.log(user);
            if(!user){
				console.log("user not found");
                return done(null, false, {message: 'User with this username does not exist'});
            }

            User.comparePassword(user.password, password, function (err, isMatch) {
				console.log("compare password called");
				if(err) throw err;
				console.log("no errrrrrrrrrrrrr called");
                if(!isMatch){
					//console.log("ismatch called");
                    return done(err, false, {message:'Incorrect Password'});
                }
				//console.log("password matched called");
                return done(null, user);
            });
        });
    }
));

router.get('/startquiz/:quizname', function(req, res, next){
	var quizname = req.params.quizname;
	Ques.getQuesByCat(quizname, function(err, ques){
		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
		console.log(ques);
		if(err){throw err};
		//res.render('takequiz', {ques:ques});
		res.send(ques);
	});
});

router.get('/takequiz', function(req, res, next){
	res.render('takequiz');
})

router.get('/quizques', function(req, res, next){
	var id = req.params.id;
	Quiz.findById({_id:id}, function(err, quiz){
		if(err){throw err};
		var ques = Ques.find({cat:quiz.quizname}).limit(10);
		res.send(ques);
	})
})


router.post('/login', function(req, res, next){

	var username = req.body.username;
	var password = req.body.password;
	console.log(username);
	console.log(password);
	console.log("login route is called");


	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { 
			console.log("^^^^^^^^^^^^^^^^^^^^^^^^^");
			console.log(user);
			return res.send({
				success: false,
				msg:"this username does not exits"
			});
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			if(user.usertype == "admin")	{
				res.redirect('/admin');
			}else{
				res.redirect('/users/')
			}
		});
	})(req, res, next);

	// User.getUserByUsername(username, function(err, user){
	// 	if(err) throw err;

	// 	if(!user){
	// 	  return res.send({msg: 'no user was found with this username'});
	// 	}

	// 	User.comparePassword(user.password, password, function(err, result){
	// 		if (err) {
	// 			throw err;
	// 			return null;
	// 		}
	// 		if(result){
	// 			if(user.username  ==  'admin'){
	// 				res.send('admin is now logged in');
	// 			}else{
	// 				res.send({msg:'You are now logged in'});
	// 			}						
	// 		}else{
	// 			res.send({msg: 'Your password is wrong'});
	// 		}

	// 	});
	// });

});



router.post('/signup', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var branch = req.body.branch;
	var usertype = "user";
	
	req.checkBody('username', 'username field is required').notEmpty();
	req.checkBody('password', 'password field is required').notEmpty();
	req.checkBody('password2', 'confirm password field is required').notEmpty();

	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(user){
			res.send("this username already exists");
		}else{

		
			var errors = req.validationErrors();

			if(errors){
				req.flash('error', 'there was some error with the signup process');
				res.send('there was some validation error');
			}else{
				var newUser = new User({	
					username: username,
					password:password,
					usertype:usertype,
					branch:branch
				});


				User.createUser(newUser, function(err, user){
					if (err) throw err;
					console.log(user);
					//res.send('user was created');
					res.redirect('/');
				});
			}
		}
	});

});

router.get('/endquiz', function(req, res, next){
	
})

router.post('/endquiz', function(req, res, next){
	var score = req.body.score;
	var subject = req.body.subject;
	var date = Date.now();
	var id = req.user._id;

	var newScore = {
		score:score,
		subject: subject,
		date:date
	};

	User.insertscores(id, newScore, function(err, data){
		if(err){throw err};
		res.send(score);
	});
})

function isAuthenticated(req,res, next){
	if(req.isAuthenticated()){return next()}
	else{
		res.redirect('/login');
	}
}

module.exports = router;