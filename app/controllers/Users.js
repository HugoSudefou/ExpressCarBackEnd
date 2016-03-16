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

            if (verifyIfPhoneAndFirstNameAreNotUndefined(user)) {
                error.push("Certaines valeurs sont incorrect");
            }

            User.findOne({username: user.username}, function (err, userInBase) {
                if (userInBase) {
                    error.push("this username already exist");
                }
            });
            console.log(error);
            if (error.length == 0) {
                var address = completeAddress(user);

                Geoloc.getLocalisationData(address)
                    .then(locData => {
                        Object.assign(user, locData);
                        return User(user).save();
                    })
                    .then(savedUser => {
                        req.session.isAuthentificated = true;
                        req.session.clientID = savedUser._id;
                        res.redirect('/index');
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
        User.findOne({'email': req.body.email}, function (err, user) {
            if (user) {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        req.session.isAuthentificated = true;
                        // permet de pouvoir via un findOne de recuperer les données de l'utilisateur dans la base
                        req.session.email = user.email;
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
                res.render('profil', {user: user});
            }
        });
    },

    /*update: function (req, res) {
        var user = req.body;
        User.findOne({email: user.email}, function (err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(user)) {
                error.push("un champ est incorrect ou manquant");
            }


            if (verifyIfPhoneAndFirstNameAreNotUndefined(user)) {
                error.push("Certaines valeurs sont incorrect");
            }
            User.findOne({username: user.username}, function (err, userInBase) {
                if (userInBase) {
                    error.push("this username already exist");
                }
            });

            if (error.length == 0) {
                var address = completeAddress(user);

                Geoloc.getLocalisationData(address)
                    .then(locData => {
                        Object.assign(user, locData);
                        console.log('Ok');
                        Object.assign(userInBase, user);
                        return userInBase.save();
                    })
                    .then(updateUser => res.redirect("/profil"))
                    .catch(error => {
                        console.error(error);
                        res.render("profil", {title: "CaRea", form: user, error: error})
                    });
            }else{
                res.render("profil", {title: "CaRea", form: user, error: error})
            }
        });
    }*/

    update: function(req, res) {
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
            if (userInBase && user.username != userToUpdate) {
                error.push("UserName is already used")
            }
        });

        if (error.length == 0) {
            var address = completeAddress(user);

            Geoloc.getLocalisationData(address)
                .then(locData => {
                    Object.assign(user, locData);
                    console.log('Ok');
                    Object.assign(userToUpdate, user);
                    return userToUpdate.save();
                })
                .then(updateUser => res.redirect("/profil"))
                .catch(error => {
                    console.error(error);
                    res.render("profil", {title: "CaRea", form: user, error: error})
                });
        } else {
            res.render("profil", {title: "CaRea", form: user, error: error})
        }
    }


};

module.exports = Users;