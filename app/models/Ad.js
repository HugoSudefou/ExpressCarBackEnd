var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT = 42; 

var ad = new mongoose.Schema({
	date : { type : Date, default : Date.now },
	heure : int,
	objet : String,
});

exports.model = mongoose.model('Ad', schema, 'ad');