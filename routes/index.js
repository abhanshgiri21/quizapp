var express = require('express');
var router = express.Router();
var Branch = require('../models/branches');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/signup', function(req, res, next){
	Branch.getBranch(function(err, branches){
		if(err){throw err};
		res.render('signup', {branches:branches});
	})
});



module.exports = router;
