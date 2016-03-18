var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	username: String,
	email: String,
	object : String,
	start : String,
	end : String,
	date : { type : String },
	beginHour : String,	lastHour : String,
	phoneNumber : String,
	country: String,
	latitude:Number,
	longitude: Number
});

exports.model = mongoose.model('Ad', schema, 'ad');