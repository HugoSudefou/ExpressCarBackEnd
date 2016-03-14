var express = require('express');
var router = express.Router();
var Users = require('../controllers/Ad')

/* GET users listing. */
router.post('/add', Ad.create);
router.get('/add', function(req,res){
	res.render('add');
});    
module.exports = router;
