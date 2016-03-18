/**
 * Created by Guillaume on 15/03/2016.
 */

require('../models/User');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var Files = {
    index: function(req, res){
        res.render('index', { title: 'Express', session: req.session.isAuthentificated});
    },

    about: function(req,res){
        res.render('about', {session: req.session.isAuthentificated});
    },

    add: function(req, res){
      res.render('add', {session: req.session.isAuthentificated})
    },

    signIn: function(req,res){
        res.render('signin', {session: req.session.isAuthentificated});
    },

    signUp: function(req,res){
        res.render('signup', {form:{}, session: req.session.isAuthentificated});
    },

    updateProfil: function(req, res){
        User.findOne({email: req.session.email}).exec()
            .then(user =>{
                res.render('profilEdit',{user: user, session: req.session.isAuthentificated})
            }).catch(error => console.log(error))
    },

    search: function(req, res){
      res.render('rechA', {session: req.session.isAuthentificated})
    }
};

module.exports = Files;