require('../models/User');
var https = require('https');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var asWrittingInBase = false;

function isEmpty(value) {
    return value == undefined || value == "";

}

function isEmptyChamp(req) {
    var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    return isEmpty(req.body.username) || isEmpty(req.body.name) || !regexEmail.test(req.body.email) || isEmpty(req.body.password) ||
        isEmpty(req.body.passwordV) || isEmpty(req.body.phonenumber) || isEmpty(req.body.address)  || isEmpty(req.body.postalcode)
        || isEmpty(req.body.city) || isEmpty(req.body.country)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(req){
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

            if(verifyIfPhoneAndFirstNameAreNotUndefined(req)){
                error.push("Certaines valeurs sont incorrect");
            }

            var datasMaps = "";
            var addressInLine = req.body.address + ", "+ req.body.postalcode + ", " + req.body.city + ", " + req.body.country;
            var options = {
                host: "maps.googleapis.com",
                path: '/maps/api/geocode/json?address=' + addressInLine.replace(/\s/g, "+") + '&key=AIzaSyBh-ZMhtx_g97Xs2ZLBryqd8ldApqo_veI'
            };

            https.get(options, function(res){
                res.setEncoding('utf8');

                res.on('data',function(chunk){
                    datasMaps += chunk;
                });
                res.on('end', function(){
                   datasMaps = JSON.parse(datasMaps);
                   if(datasMaps.status != "OK"){
                       error.push("L'adresse est introuvable");
                   }
                    else if(datasMaps.results[0].address_components[0].types == 'street_number'){
                       WriteInbase(req, res);
                   }
                    else{
                       error.push("l'addresse n'est pas valide");
                   }


                });

                function WriteInbase(req, res) {
                    if (error.length == 0) {
                        var addressComponents = datasMaps.results[0].address_components;
                        var coordinates = datasMaps.results[0].geometry.location;
                        console.log(addressComponents);
                        //apeller la fonction qui va trouver la latitude et longitude en fonction de l'adresse

                        var newUser = new User({
                            username: req.body.username,
                            name: req.body.name,
                            firstname: req.body.firstname,
                            email: req.body.email,
                            password: req.body.password,
                            passwordV: req.body.passwordV,
                            phonenumber: req.body.phonenumber,
                            address: addressComponents[0].long_name + " " + addressComponents[1].long_name,
                            postalcode: addressComponents[6].long_name,
                            city: addressComponents[2].long_name,
                            country: addressComponents[5].long_name,
                            latitude: coordinates.lat,
                            longitude: coordinates.lng
                        });

                        newUser.save(function (err) {
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