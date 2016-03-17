/**
 * Created by Guillaume on 15/03/2016.
 */

require('../models/User');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var Files = {
    index: function(req, res){
        res.render('index', { title: 'Express' });
    },

    about: function(req,res){
        res.render('about');
    },

    add: function(req, res){
      res.render('add')
    },

    signIn: function(req,res){
        res.render('signin');
    },

    signUp: function(req,res){
        res.render('signup', {form:{}});
    },

    updateProfil: function(req, res){
        User.findOne({email: req.session.email}).exec()
            .then(user =>{
                res.render('profilEdit',{user: user})
            }).catch(error => console.log(error))

    }
};

module.exports = Files;