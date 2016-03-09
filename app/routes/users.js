var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users')

/* GET users listing. */
router.get('/signup', Users.create);

module.exports = router;
