/**
 * Created by Guillaume on 15/03/2016.
 */

var Files = {
    index: function(req, res){
        res.render('index', { title: 'Express', session: req.session.isAuthentificated});
    },

    about: function(req,res){
        res.render('about', {form:{}, session: req.session.isAuthentificated});
    },

    signIn: function(req,res){
        res.render('signin', {form:{}, session: req.session.isAuthentificated});
    },

    signUp: function(req,res){
        res.render('signup', {form:{}, session: req.session.isAuthentificated});
    },
    construct: function(req,res){
        res.render('construct');
    }

};

module.exports = Files;