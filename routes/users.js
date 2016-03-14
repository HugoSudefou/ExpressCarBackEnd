var express = require('express');
var router = express.Router();

var Users = require('./app/controllers/Users');
/* GET users listing. */
router.get('/', function(req, res) {
  res.render('signup');
});
router.get('/signin', function(req, res){
	res.render('signin');
});
router.post('/signup', Users.create);
router.post('/signin', Users.signIn);

module.exports = router;
