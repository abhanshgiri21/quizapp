var express = require('express');
var router = express.Router();
var User = require('../models/User.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', function(req, res, next){

    var username = req.body.username;
    var password = req.body.password;

    User.getUserByUsername(username, function(err, user){
        if(err) throw err;

        if(!user){
          return res.send({msg: 'no user was found with this username'});
        }

        User.checkPassword(user, password, function(err, result){
          if (err) {
            throw err;
            return null;
          }
          if(user){
            res.send({msg:'You are now logged in'});
          }else{
            res.send({msg: 'Your password is wrong'});
          }

        })
    });

});

router.post('/signup', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	

});

module.exports = router;
