var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// user schema
var userSchema = mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String	
	},
	password: {
		type: String	
	},
	name: {
		type: String	
	},
	join_date: {
		type: Date
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
})

//Permite usar User fuera de este archivo
var User = module.exports = mongoose.model('User', userSchema);

//Obtiene user por Id
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}


//Compara los passwords
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err){return callback(err);}
		else {callback(null, isMatch);}
	})
}

//Add usuario
module.exports.addUser = function(user, callback){
	User.create(user, callback);
}