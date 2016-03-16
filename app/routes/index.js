var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users');
var Files = require('../controllers/Files');


function isNotClient(req, res, next){
  if(req.session.isAuthentificated == true){
    return res.redirect('/index?error=alreadyConnected')
  }else{
    next();
  }
}
/* GET home page. */
router.get('/annonces', function(req,res){
  res.render('annonces');
});
router.get('/add', function(req,res){
  res.render('add');
});

router.get('/', Files.index);
router.get('/index', Files.index);

router.get('/about',Files.about);

router.get('/signUp', Files.signUp);
router.post('/signup',Users.create);

router.get('/signin',isNotClient, Files.signIn);
router.post('/signin', isNotClient, Users.signIn);
module.exports = router;
