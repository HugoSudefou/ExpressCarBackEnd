var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users');
var Files = require('../controllers/Files');
var Ad = require('../controllers/Ad');

function isClient(req, res, next){
	if(req.session.isAuthentificated){
		next();
	}else{
		return res.redirect('/signin?error=notConnected')
	}
}

/* GET users listing. */


//router.post('/ad', Ad.search);

router.get('/search', isClient, Files.search);

router.post('/search', isClient, Ad.search);

router.get('/add',isClient,Files.add);
router.post('/add',isClient, Ad.create);
/* GET users listing. */
router.get('/profil', isClient, Users.viewProfil);
router.get('/updateProfil', isClient,Files.updateProfil);
router.post('/updateProfil', isClient, Users.update);
router.get('/signout', isClient, Users.signOut);

module.exports = router;
