var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT = 42; 

var schema = new mongoose.Schema({
	object : String,
	start : String,
	end : String,
	date : { type : Date, default : Date.now },
	hour : Number,
	brandCar : String,
	phoneNumber : String,
  	car : { type: Boolean, required: false }
});

exports.model = mongoose.model('Ad', schema, 'ad');