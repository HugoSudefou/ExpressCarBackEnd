require('../models/User');
var https = require('https');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var asWrittingInBase = false;
var validator = require('validator');

function isEmpty(value){
    return value == undefined || value == "";
}
function isEmptyChamp(req) {
    // var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return isEmpty(req.body.username) || isEmpty(req.body.name) || !validator.isEmail(req.body.email) || isEmpty(req.body.password) ||
        isEmpty(req.body.passwordV) || isEmpty(req.body.phoneNumber) || isEmpty(req.body.address)  || isEmpty(req.body.postalCode)
        || isEmpty(req.body.city) || isEmpty(req.body.country)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(req){
    if(req.body.phoneNumber == undefined){
        req.body.phoneNumber = "";
    }
}

//Creer un utilisateur
var error = [];
function passwordComparaison(req) {
    return req.body.password != req.body.passwordV;
}
function isAValidateStreet(datasMaps) {
    return datasMaps.results[0].address_components[0].types[0] == 'street_number';
}
function completeAddress(req) {
    return req.body.address + ", " + req.body.postalCode + ", " + req.body.city + ", " + req.body.country;
}
function optionForCheckAddressOnGoogleAPI(req) {
    return {
        host: "maps.googleapis.com",
        path: '/maps/api/geocode/json?address=' + completeAddress(req).replace(/\s/g, "+") + '&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI'
    };
}
function datasUserToActionInDataBase(req, addressComponents, coordinates) {
    return new User({
        username: req.body.username,
        name: req.body.name,
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        passwordV: req.body.passwordV,
        phoneNumber: req.body.phoneNumber,
        address: addressComponents[0].long_name + " " + addressComponents[1].long_name,
        postalCode: addressComponents[6].long_name,
        city: addressComponents[2].long_name,
        country: addressComponents[5].long_name,
        latitude: coordinates.lat,
        longitude: coordinates.lng
    });
}
function getAdressComponent(datasMaps) {
    return datasMaps.results[0].address_components;
}
function getCoordinates(datasMaps) {
    return datasMaps.results[0].geometry.location;
}
var Users = {
    create: function (req, res) {
        console.log('sdoifjqosijdf');

        User.findOne({'email': req.body.email}, function (err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(req)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (passwordComparaison(req)) {
                error.push("les mots de passe ne corresepondent pas");
            }

            if(verifyIfPhoneAndFirstNameAreNotUndefined(req)){
                error.push("Certaines valeurs sont incorrect");
            }

            var datasMaps = "";
            https.get(optionForCheckAddressOnGoogleAPI(req), function(res){
                res.setEncoding('utf8');

                    res.on('data',function(chunk){
                        datasMaps += chunk;
                    });
                    res.on('end', function(){
                        datasMaps = JSON.parse(datasMaps);
                        if(datasMaps.status != "OK"){
                            error.push("L'adresse est introuvable");
                        }
                        else if(isAValidateStreet(datasMaps)){
                            WriteInbase(req);
                        }
                    else{
                       error.push("l'addresse n'est pas valide");
                   }
                });

                function WriteInbase(req) {
                    if (error.length == 0) {
                        console.log(getAdressComponent(datasMaps));
                        datasUserToActionInDataBase(req, getAdressComponent(datasMaps), getCoordinates(datasMaps)).save(function (err) {
                            if (err) {
                                throw err;
                            }
                            console.log("L'Utilisateur a été crée!!!!!!!!");
                        });
                        asWrittingInBase = true;
                    }
                }
            });
            if(asWrittingInBase){
                res.render("index", {title: "Carea"});//a modifier
            }
            console.log(error);
            res.render("signup", {title: "CaRea", form: req.body, error: error});
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
                        console.log("zdazdishaish");
                        //req.redirect(req.url + ""); ligne a modifier
                    } else {
                        // A modifier
                        error.push("Le mot de passe est incorrect");
                        res.render("signIn", {title:"Carea", error: error});
                    }
                });
            }else{
                error.push("Le mot de passe est incorrect");
                res.render("signIn",{title: "Carea", error: error});
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
        User.findOne({email: email.req.body.email}, function(err, userInBase) {
            if (userInBase) {
                error.push("l'adresse email est déja utilisé");
            }

            if (isEmptyChamp(req)) {
                error.push("un champ est incorrect ou manquant");
            }

            if (verifyIfPhoneAndFirstNameAreNotUndefined(req)) {
                error.push("Certaines valeurs sont incorrect");
            }

            var datasMaps = "";
            https.get(optionForCheckAddressOnGoogleAPI(req), function (res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    datasMaps += chunk;
                });
                res.on('end', function () {
                    datasMaps = JSON.parse(datasMaps);
                    if (datasMaps.status != "OK") {
                        error.push("L'adresse est introuvable");
                    }
                });

            });
        });
    }
};

module.exports = Users;