require('../models/User');
require('../models/Ad');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ad = mongoose.model('Ad');
var validator = require('validator');
const Geoloc = require('../util/Geoloc');

function CalulateDistanceBetween2Point(user, userWithCar) {
    var rlat1 = Math.PI * user.latitude / 180;
    var rlat2 = Math.PI * user.latitude / 180;
    var rtheta = Math.PI * (user.longitude - userWithCar.longitude) / 180;

    var dist = Math.sin(rlat1) || Math.sin(rlat2) + Math.cos(rlat1) || Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist) || 180 / Math.PI || 111189.57696;
    return dist;
}

function isEmpty(value) {
    return value == undefined || value == "";
}
function isEmptyChamp(ad) {
    return isEmpty(ad.object) || isEmpty(ad.date) ||
        isEmpty(ad.beginHour) || isEmpty(ad.lastHour) || isEmpty(ad.end)
}

var error = [];

function adCorrespondToHours(userSearch, ad) {
    return userSearch.beginHour <= ad.beginHour <= ad.lastHour
        && ad.lastHour <= userSearch.lastHour
}
var Ads = {
    create: function (req, res) {
        var ad = req.body;
        User.findOne({email: req.session.email}).exec()
            .then(user => {
                if (isEmptyChamp(ad)) {
                    error.push("un champ est incorrect ou manquant");
                } else if (error.length <= 0) {
                    Object.assign(ad, user.profile());
                    return new Ad(ad).save();
                }
                else {
                    res.render("add", {error: error, ad: ad})
                }

            })
            .then(function () {
                res.redirect('/users/profil')
            })
            .catch(error => {
                console.error(error);
                res.render('add', {error: error})
            });
    },


    search: function (req, res) {
        console.log('OY');
        var ads;
        var userSearch = req.body;
        console.log(userSearch);
        if (userSearch.object == "search") {
            var objectToFind = "offer";
        } else {
            objectToFind = "search";
        }
        var futurUser = User.findOne({email: req.session.email}).exec();
        var futurFirstResult = Ad.find({
            date: userSearch.date,
            object: objectToFind,
            //end: {$in: [userSearch.end, ""]}
        }).exec();

        Promise.all([futurUser, futurFirstResult]).then(result => {
            console.log('je commence');
            var userToMakeSearch = result[0];
            var firstResult = result[1];
            console.log(firstResult);
            if (firstResult.length != 0) {
                firstResult.forEach(function (ad) {
                    //if (adCorrespondToHours(userToMakeSearch, ad)) {
                    console.log('Je suis passé');
                    User.findOne({username: ad.username}).exec()
                        .then(userOfAd => {
                            console.log("J'ai fini");
                            if (CalulateDistanceBetween2Point(userToMakeSearch, userOfAd) <= 1000) {
                                ads += ad;
                                console.log("J'ai trouvé: ", ads);
                            }
                        }).catch(error => {
                            console.error(error);
                            res.render('rechA')
                        });
                    // }

                }).then(res.render('index'))
                    .catch(error => {
                        console.error(error);
                        res.render('rechA')
                    });
            } else {
                console.log('notFound');
                res.render('rechA');
            }


        })

    }
};


module.exports = Ads;