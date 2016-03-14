require('../models/User');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var validator = require('validator');

const Geoloc = require('../util/Geoloc');

function isEmpty(value){
    return value == undefined || value == "";
}
function isEmptyChamp(user) {
    return isEmpty(user.username) || isEmpty(user.name) || !validator.isEmail(user.email) || isEmpty(user.password) ||
        isEmpty(user.passwordV) || isEmpty(user.phoneNumber) || isEmpty(user.address)  || isEmpty(user.postalCode)
        || isEmpty(user.city) || isEmpty(user.country)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(user){
    if(user.phonenumber == undefined){
        user.phonenumber = "";
    }
}

//Creer un utilisateur
var error = [];
function passwordComparaison(user) {
    return user.password != user.passwordV;
}

function completeAddress(user) {
    return user.address + ", " + user.postalCode + ", " + user.city + ", " + user.country;
}


var Users = {
    create: function (req, res) {
        const user = req.body;

        User.findOne({'email': user.email}, function (err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(user)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (passwordComparaison(user)) {
                error.push("les mots de passe ne corresepondent pas");
            }

            if(verifyIfPhoneAndFirstNameAreNotUndefined(user)){
                error.push("Certaines valeurs sont incorrect");
            }

            var address = completeAddress(user);

            Geoloc.getLocalisationData(address)
                .then(locData => {
                    Object.assign(user, locData);
                    console.log(user);
                    return User(user).save();
                })
                .then(savedUser => res.render("index", {title: savedUser._id}))
                .catch(error => {
                    console.error(error);
                    res.render("signup", {title: "CaRea", form: req.body, error: error})
                });
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
                        res.render("signin", {title:"Carea", error: error});
                    }
                });
            }else{
                error.push("L'email  est incorrect");
                res.render("signin",{title: "Carea", error: error});
            }
        });
    },

    viewProfil: function(req, res) {
      User.findOne({email: req.body.email}, function(err, user){
          if(user && req.session.isAuthentificated == true){
              res.render('profil', {title: "Carea", user: user});
          }
      });
    },

    update: function(req, res){
        var user = req.body;
        User.findOne({email:user.email}, function(err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(user)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (verifyIfPhoneAndFirstNameAreNotUndefined(user)) {
                error.push("Certaines valeurs sont incorrect");
            }

            var address = completeAddress(user);

            Geoloc.getLocalisationData(address)
                .then(locData => {
                    Object.assign(user, locData);
                    console.log('Ok');
                    return User(user).update();
                })
                .then(updateUser => res.render("index", {title: updateUser._id}))
                .catch(error => {
                    console.error(error);
                    res.render("signup", {title: "CaRea", form: user, error: error})
                });
        });
    }
};

module.exports = Users;