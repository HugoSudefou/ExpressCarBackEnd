var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT = 42; 

var schema = new mongoose.Schema({
  username : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  name : {type: String, required: true},
  firstname : String,
  email: { type: String, required: true },  
  password: { type: String, required: true },
  passwordV: { type: String, required: true },  
  phonenumber : String,
  address : { type: String, required: true },
  postalcode : { type: String, required: true },
  city : { type: String, required: true},
  country: {type: String, required: true},
  longitude : Number,
  latitude : Number,
  car : { type: Boolean, required: true }
});

//Appelé avant d'effectuer la sauvegarde d'un utilisateur
schema.pre('save', function (next) {
    var user = this;
    // si le mot de passe est modifié ou crée
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

exports.model = mongoose.model('User', schema, 'user');