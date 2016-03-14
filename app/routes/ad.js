var express = require('express');
var router = express.Router();
var Users = require('../controllers/Ad')

/* GET users listing. */
router.post('/ad', Ad.create);
router.get('/ad', function(req,res){
	res.render('signup');
});    
module.exports = router;
