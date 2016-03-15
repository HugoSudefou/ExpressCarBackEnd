/**
 * Created by Guillaume on 15/03/2016.
 */

var Files = {
    index: function(res){
        res.render('index', { title: 'Express' });
    },

    about: function(res){
        res.render('about');
    },

    signIn: function(res){
        res.render('signin');
    },

    signUp: function(res){
        res.render('signup', {form:{}});
    }

};

