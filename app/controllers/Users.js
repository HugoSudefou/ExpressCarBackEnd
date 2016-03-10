require('../models/User');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

function isEmpty(value) {
    return value == undefined || value == "";

}

function isEmptyChamp(req) {
    var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    return isEmpty(req.body.username) || isEmpty(req.body.name) || isEmpty(req.body.firstname) || !regexEmail.test(req.body.email) || isEmpty(req.body.password) ||
        isEmpty(req.body.passwordV) || isEmpty(req.body.phonenumber) || isEmpty(req.body.address) || isEmpty(req.body.postalcode) || isEmpty(req.body.city)
}

function veriFyIFPhoneAndFirstNameAreNotUndefined(req){
    if(req.body.phonenumber == undefined){
        req.body.phonenumber = "";
    }
    if(req.body.firstname == undefined){
        req.body.firstname = "";
    }
}

//Creer un utilisateur
var error = [];
var Users = {
    create: function (req, res) {
        User.findOne({'email': req.body.email}, function (err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(req)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (req.body.password != req.body.passwordV) {
                error.push("les mots de passe ne corresepondent pas");
            }

            if(veriFyIFPhoneAndFirstNameAreNotUndefined(req)){
                error.push("Certaines valeurs sont incorrect");
            }

            if (error == []) {
                //apeller la fonction qui va trouver la latitude et longitude en fonction de l'adresse
                var newUser = new User({
                    username: req.body.username,
                    name: req.body.name,
                    firstname: req.body.firstname,
                    email: req.body.email,
                    password: req.body.password,
                    passwordV: req.body.passwordV,
                    phonenumber: req.body.phonenumber,
                    address: req.body.address,
                    postalcode : req.body.postalcode,
                    city : req.body.city,
                    longitude : req.body.longitude,
                    latitude : req.body.latitude,
                    car : req.body.car
                });

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("L'Utilisateur a été crée!!!!!!!!");
                    console.log(u);
                });
                res.render("index", {title: "Carea"});//a modifier
            }

            res.render("signup", {title: "Carea", form: req.body, error: error});
        });
    },

    signIn: function (req, res) {
        User.findOne({'email': req.body.email}, function (err, user) {
            if (user) {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        req.session.isAuthentificated = true;
                        // permet de pouvoir via un findOne de recuperer les données de lutilisateur dans la base
                        req.session.email = user.email;
                        //req.redirect(req.url + ""); ligne a modifier
                    } else {
                        // A modifier
                        error.push("Le mot de passe est incorrect");
                        req.render("signIn", {title:"Carea", error: error});
                    }
                });
            }else{
                error.push("Le mot de passe est incorrect");
                req.render("signIn",{title: "Carea", error: error});
            }
        });
    }
};


module.exports = Users;