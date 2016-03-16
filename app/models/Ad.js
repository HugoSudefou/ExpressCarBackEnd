var mongoose = require('mongoose');

var ad = new mongoose.Schema({
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