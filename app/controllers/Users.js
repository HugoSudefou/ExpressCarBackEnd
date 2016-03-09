require('../models/User');
var mongoose = require('mongoose'),
User = mongoose.model('User');

var Users = {
	create : function(req, res) {
		var u = new User({
			username : req.body.username,
			name : req.body.name,
			firstname : req.body.firstname,
			email : req.body.email,
			password : req.body.password,
			passwordV : req.body.passwordV,
			phonenumber : req.body.phonenumber,
			address : req.body.address,

		});
		u.save(function(err){
			if(err){
				throw err;
			}
			console.log("L'User a été crée!!!!!!!!");
			console.log(u);
		});
		res.send("Tu es inscrit ;)");
	}
}; 

module.exports = Users;