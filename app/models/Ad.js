var mongoose = require('mongoose');
var ad = new mongoose.Schema({
	object : Boolean,
	start : String,
	end : String,
	date : { type : Date, default : Date.now },
	beginHour : int,
	lastHour : int,
	phoneNumber : String
});

exports.model = mongoose.model('Ad', schema, 'ad');