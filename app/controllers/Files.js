/**
 * Created by Guillaume on 15/03/2016.
 */

var Files = {
    index: function(req, res){
        res.render('index', { title: 'Express' });
    },

    about: function(req,res){
        res.render('about');
    },

    signIn: function(req,res){
        res.render('signin');
    },

    signUp: function(req,res){
        res.render('signup', {form:{}});
    }

};

module.exports = Files;