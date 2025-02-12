var express = require('express');
var router = express.Router();
var Users = require('../controllers/Users');
var Files = require('../controllers/Files');


function isNotClient(req, res, next) {
    if (req.session.isAuthentificated == true) {
        return res.redirect('/index?error=alreadyConnected')
} else {
        next();
    }
}

/* GET home page. */

router.get('/', Files.index);
router.get('/index', Files.index);

router.get('/about', Files.about);

router.get('/signup', isNotClient, Files.signUp);
router.post('/signup', isNotClient, Users.create);

router.get('/signin', isNotClient, Files.signIn);
router.post('/signin', isNotClient, Users.signIn);

router.get('/signout', Users.signOut);

router.get('/construct', Files.construc);
router.get('/faq', Files.faq);
router.get('/teaser', Files.teaser);
module.exports = router;
