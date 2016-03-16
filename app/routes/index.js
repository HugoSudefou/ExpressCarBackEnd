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

router.get('/ad', function (req, res) {
    res.render('ad');
});
router.get('/add', function (req, res) {
    res.render('add');
});

router.get('/', Files.index);
router.get('/index', Files.index);

router.get('/about', Files.about);

router.get('/signUp', isNotClient, Files.signUp);
router.post('/signup', isNotClient, Users.create);

router.get('/signin', isNotClient, Files.signIn);
router.post('/signin', isNotClient, Users.signIn);
module.exports = router;
