var mongoose = require('mongoose');
var ad = new mongoose.Schema({
	object : String,
	start : String,
	end : String,
	date : { type : Date, default : Date.now },
	hour : int,
	brandCar : String,
	phoneNumber : String,	
});

exports.model = mongoose.model('Ad', schema, 'ad');