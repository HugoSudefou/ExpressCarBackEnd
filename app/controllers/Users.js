require('../models/User');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var validator = require('validator');

const Geoloc = require('../util/Geoloc');

function isEmpty(value) {
    return value == undefined || value == "";
}
function isEmptyChamp(user) {
    return isEmpty(user.username) || isEmpty(user.name) || !validator.isEmail(user.email) || isEmpty(user.password) ||
        isEmpty(user.passwordV) || isEmpty(user.phoneNumber) || isEmpty(user.address) || isEmpty(user.postalCode)
        || isEmpty(user.city) || isEmpty(user.country)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(user) {
    if (user.phoneNumber == undefined) {
        user.phoneNumber = "";
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
        error = [];
        const user = req.body;

        User.findOne({'email': user.email}, function (err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(user)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (passwordComparaison(user)) {
                error.push("les mots de passe ne correspondent pas");
            }

            if (verifyIfPhoneAndFirstNameAreNotUndefined(user)) {
                error.push("Certaines valeurs sont incorrect");
            }
            
            User.findOne({username: user.username}, function (err, userInBase) {
                if (userInBase) {
                    error.push("Ce pseudo existe deja");
                }
            });
            console.log(error);
            if (error.length == 0) {
                var address = completeAddress(user);

                Geoloc.getLocalisationData(address)
                    .then(locData => {
                        Object.assign(user, locData);
                        console.log(user);
                        return User(user).save();
                    })
                    .then(savedUser => {
                        req.session.isAuthentificated = true;
                        req.session.email = user.email;
                        req.session.clientID = savedUser._id;
                        res.redirect('/users/profil');
                    })
                    .catch(error => {
                        console.error(error);
                        res.render("signup", {title: "CaRea", form: req.body, error: error})
                    });
            } else {
                res.render("signup", {title: "CaRea", form: req.body, error: error})
            }

        });

    },

    signIn: function (req, res) {
        error = [];
        User.findOne({'email': req.body.email}, function (err, user) {
            if (user) {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        req.session.isAuthentificated = true;
                        // permet de pouvoir via un findOne de recuperer les données de l'utilisateur dans la base
                        req.session.email = user.email;
                        //Object.assign(req.session, user);
                        res.redirect('/users/profil')
                    } else {
                        error.push("Le mot de passe est incorrect");
                        res.render("signin", {title: "Carea", error: error});
                    }
                });
            } else {
                error.push("L'email  est incorrect");
                res.render("signin", {title: "Carea", error: error});
            }
            console.log(error);
        });
    },

    signOut: function (req, res) {
        req.session.isAuthentificated = false;
        req.session.clientID = "";
        res.redirect('/signin')
    },

    viewProfil: function (req, res) {
        User.findOne({email: req.session.email}, function (err, user) {
            if (user) {
                res.render('profil', {user: user, session: req.session.isAuthentificated});
            }
        });
    },

    update: function(req, res) {
        error = [];
        var user = req.body;
        var userToUpdate;
        User.findOne({email: req.session.email}, function (err, userRequest) {
            userToUpdate = userRequest;
        });

        User.findOne({email: user.email}, function (err, userInBase) {
            if (userInBase && user.email != userToUpdate.email) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(user)) {
                error.push("un champ est incorrect ou manquant");
            }


            if (verifyIfPhoneAndFirstNameAreNotUndefined(user)) {
                error.push("Certaines valeurs sont incorrect");
            }
        });

        User.findOne({username: user.username}, function (err, userInBase) {
            if (userInBase && user.username != userToUpdate.username) {
                error.push("UserName is already used")
            }
        });

        if (error.length == 0) {
            var address = completeAddress(user);

            Geoloc.getLocalisationData(address)
                .then(locData => {
                    Object.assign(user, locData);
                    console.log(userToUpdate);
                    Object.assign(userToUpdate, user);
                    console.log(userToUpdate);
                    return userToUpdate.save();
                })
                .then(function(){
                    req.session.email = userToUpdate.email;
                    res.redirect("/users/profil");
                })
                .catch(error => {
                    console.error(error);
                    console.log(user);
                    res.render("profilEdit", {title: "CaRea", user: userToUpdate, error: error})
                });
        } else {
            console.log(error);
            console.log(user);
            res.render("profilEdit", {title: "CaRea", user: userToUpdate, error: error})
        }
    }
};
module.exports = Users;