var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users')

/* GET users listing. */
router.post('/signup', Users.create);
router.get('/signup', function(req,res){
	res.render('signup');
})
router.post('/signin', Users.signIn);
router.get('/signin', function(req,res){
	res.render('signin');
})
module.exports = router;
