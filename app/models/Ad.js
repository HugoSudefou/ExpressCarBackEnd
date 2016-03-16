var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT = 42; 

var schema = new mongoose.Schema({
	object : String,
	address : String,
	city : String,
	country : String,
	zipCode : String,
	date : { type : Date, default : Date.now },
	hour : Number,
	brandCar : String,
	phoneNumber : String,
});

exports.model = mongoose.model('Ad', schema, 'ad');