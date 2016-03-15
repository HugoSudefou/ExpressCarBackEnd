var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users');

function isClient(req, res, next){
	if(req.session.isAuthentificated){
		next();
	}else{
		return res.redirect('/signin?error=notConnected')
	}
}
/* GET users listing. */
router.get('/profil', isClient, Users.viewProfil);
router.get('/updateProfil', isClient, Users.update);
router.get('/signout', isClient, Users.signOut);

module.exports = router;
