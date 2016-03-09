var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  username : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  name : String,
  firstname : String,
  email: { type: String, required: true },  
  password: { type: String, required: true },
  passwordV: { type: String, required: true },  
  phonenumber : String,
  address : String,
  postalcode : Number,
  city : String,
  longitude : Number,
  latitude : Number,
  car : Boolean,
});

exports.model = mongoose.model('User', schema, 'user');