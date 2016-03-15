var express = require('express');
var router = express.Router();
var Ad = require('../controllers/Ad');

/* GET users listing. */
router.post('/add', Ad.create);

//router.post('/ad', Ad.search);

router.get('/add', function(req,res){
	res.render('add');
});    
module.exports = router;
