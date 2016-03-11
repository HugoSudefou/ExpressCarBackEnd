var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/about', function(req,res){
  res.render('about');
});
router.get('/index', function(req,res){
  res.render('index');
});
router.get('/signup', function(req,res){
  res.render('signup');
});
router.get('/signin', function(req,res){
  res.render('signin');
});

module.exports = router;
