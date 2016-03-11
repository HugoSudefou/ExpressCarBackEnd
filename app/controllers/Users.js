require('../models/User');
var mongoose = require('mongoose'),
User = mongoose.model('User');

function isEmpty(value){
	return value == undefined || value == "";
	
}

function isEmptyChamp(req){
	var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	
	return isEmpty(req.body.username) || isEmpty(req.body.name) || isEmpty(req.body.firstname) || !regexEmail.test(req.body.email) || isEmpty(req.body.password) || isEmpty(req.body.passwordV) || isEmpty(req.body.phonenumber) || isEmpty(req.body.address)
}

//Creer un utilisateur
var Users = {
	create : function(req, res) {

		console.log("sfdq");
		return 0;

		var error = [];
		User.findOne({'email' : req.body.email}, function(err, userInBase){
			if(userInBase){
				error.push("l'adresse email est déja utilisé");
			}
			
			if(isEmptyChamp(req)){
				error.push("un champ est incorrect ou manquant");
			}
			
			if(req.body.password != req.body.passwordV){
				error.push("les mots de passe ne corresepondent pas");
			}
			
			if(error == ""){
				var newUser = new User({
					username : req.body.username,
					name : req.body.name,
					firstname : req.body.firstname,
					email : req.body.email,
					password : req.body.password,
					passwordV : req.body.passwordV,
					phonenumber : req.body.phonenumber,
					address : req.body.address,

				});
			
				newUser.save(function(err){
					if(err){
						throw err;
					}
					console.log("L'Utilisateur a été crée!!!!!!!!");
					console.log(u);
				});
				res.render("index", {title: "Carea"});
			}
			
			res.render("signup", {title: "Carea", form: req.body, error: error});
		});
	},
	
	signIn : function(req,  res){
		User.findOne({'email': req.body.email}, function(err, user){
			if(user){
				user.comparePassword(req.body.password, function (err, isMatch) {
					 if (isMatch) {
							 req.session.isAuthentificated = true;
							 req.session.email = user.email; // permet de pouvoir via un findOne de recuperer les données de lu'tilisateur dans la base
							 
							 //Mettre la redirection 
					} else {
							// A modifier
							req.redirect(req.url+"");
					}
				});
			}
		});
	}
};	

module.exports = Users;