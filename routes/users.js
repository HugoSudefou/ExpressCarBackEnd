var express = require('express');
var router = express.Router();

var Users = require('./app/controllers/Users');
/* GET users listing. */
router.get('/', function(req, res) {
  res.render('signup');
});
app.get('/', function(req, res) {
  res.send('about');
});
router.post('/signup', Users.create);

module.exports = router;
