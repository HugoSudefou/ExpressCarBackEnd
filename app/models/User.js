var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT = 42; 

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