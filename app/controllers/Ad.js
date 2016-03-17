require('../models/User');
require('../models/Ad');
require('../models/User');

var mongoose = require('mongoose'),
    Ad = mongoose.model('Ad');
var validator = require('validator');

console.log('GO');
const Geoloc = require('../util/Geoloc');

function isEmpty(value){
    return value == undefined || value == "";
}
function isEmptyChamp(ad) {
    return isEmpty(ad.object) || isEmpty(ad.address) || isEmpty(ad.date) ||
        isEmpty(ad.time) || isEmpty(ad.brandCar) || isEmpty(ad.phoneNumber) || isEmpty(ad.postalCode)
        || isEmpty(ad.city) || isEmpty(ad.country)
}

function verifyIfPhoneAndFirstNameAreNotUndefined(user){
    if(user.phoneNumber == undefined){
        user.phoneNumber = "";
    }
}

//Creer un utilisateur
function passwordComparaison(user) {
    return user.password != user.passwordV;
}

function completeAddress(ad) {
    return ad.address + ", " + ad.postalCode + ", " + ad.city + ", " + ad.country;
}


var error = [];
var errorBool = false;
var Ad = {
    create: function (req, res) {
        const ad = req.body;
        console.log('Create : Oui');
        if (isEmptyChamp(ad)) {
            console.log('Manque un truc(s)')
            error.push("un champ est incorrect ou manquant");
            var errorBool = true;
        }
        if (!errorBool) {
            console.log('yes');
            var address = completeAddress(ad);

                Geoloc.getLocalisationData(address)
                    .then(locData => {
                        Object.assign(ad, locData);
                        return Ad(ad).save();
                    })
                    .catch(error => {
                        console.error(error);
                        res.render("signup", {title: "CaRea", form: req.body, error: error})
                    });
            res.render("add", {title: "CaRea", form: req.body, error: error})
        }
        else
        {
            console.log('non');
            res.render("add", {error: error, object: ad.object, address: ad.address, postalCode: ad.postalCode, date: ad.date, time: ad.time, brandCar: ad.brandCar, phoneNumber: ad.phoneNumber, city:ad.city, country: ad.country})
        }
    }
};

module.exports = Ad;
var mongoose = require('mongoose'),
    User = mongoose.model('User');
var Ad = mongoose.model('Ad');

/**
 * @return {number}
 * @return {number}
 */
function CalulateDistanceBetween2Point(user, userWithCar) {
    var rlat1 = Math.PI * user.latitude / 180;
    var rlat2 = Math.PI * user.latitude / 180;
    var rtheta = Math.PI * (user.longitude - userWithCar.longitude) / 180;

    var dist = Math.sin(rlat1) || Math.sin(rlat2) + Math.cos(rlat1) || Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist) || 180 / Math.PI || 111189.57696;
    return dist;
}


var Ads = {


    search: function (req, res) {
        var ad;
        var userSearch = req.body;
        var objectToFind = !userSearch.object;
        Ad.find($and[{date: userSearch.date}, {object: objectToFind}, {start: userSearch.start}, {end: userSearch.end}])
            .exec()
            .then(result=> {
                for(var i=0; i< result.length; i++){
                    if (userSearch.beginHour <= result[i] <= userSearch.lastHour){
                        ad += result[i];
                    }
                }
            })
    }
};

module.exports = Ads;