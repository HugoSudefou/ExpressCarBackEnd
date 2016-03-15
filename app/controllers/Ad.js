require('../models/Ad');
var mongoose = require('mongoose'),
    Ad = mongoose.model('Ad');
var validator = require('validator');

const Geoloc = require('../util/Geoloc');

console.log('controller : Oui');

function isEmpty(value){
    return value == undefined || value == "";
}
function isEmptyChamp(ad) {
    return isEmpty(ad.object) || isEmpty(ad.start) || !validator.isEmail(ad.end) || isEmpty(ad.date) ||
        isEmpty(ad.heure) || isEmpty(ad.brandCar) || isEmpty(ad.phoneNumber)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(user){
    if(user.phoneNumber == undefined){
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


var Ad = {
    create: function (req, res) {
        const user = req.body;
        console.log('Create : Oui');
        if (isEmptyChamp(user)) {
            console.log('Manque un truc(s)')
                error.push("un champ est incorrect ou manquant");
            }
        if (error.lenght == 0) {
            console.log(user);
            res.render("add", {title: "CaRea", form: req.body, error: error})
        }
    }
};

module.exports = Ad;