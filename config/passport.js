var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.getUserById(id, function(err, user) {
	    done(err, user);
	  });
	});

	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done){

		User.getUserByUsername(username, function(err, user){
			if(err){ 
				return done(err); 
			}

			//¿existe usuario?
			if(!user){
				req.flash('error', 'Usuario no encontrado');
				return done(null, false);
			}

			//¿es password válido?
			if(!isValidPassword(user, password)){
				req.flash('error', 'Password inválido');
				return done(null, false);
			}

			req.flash('success', 'Estás logueado correctamente');
			return done(null, user);
		})
	}
	));

	// Register
	passport.use('local-register', new LocalStrategy({
		passReqToCallback: true
	},
		function(req, username, password, done){
			findOrCreateUser = function(){
				//Buscar user by username
				User.findOne({username: username}, function(err, user){
					if(err){
						console.log('Error: ' +err);
						return done(err);
					}
					// Does user exists?
					if (user){
						console.log('Este usuario ya existe!');
						return done(null, false, req.flash('message', 'El usuario ya existe'));
					}
					else {
						var newUser = new User();
						newUser.username = username;
						newUser.password = createHash(password);
						newUser.email = req.param('email');
						newUser.name = req.param('name');
						newUser.join_date = new Date();

						//Add user
						User.addUser(newUser, function(err, user){
							if(err){
								console.log('Error: '+err);
							}
							else{
								req.flash('message', 'Registro OK, ya puedes iniciar sesión');
								return done(null, newUser);
							}
						});
					}
				})
			}

			//TODO: ? No se que hace aca
			process.nextTick(findOrCreateUser);
		}
	));

	var isValidPassword = function(user, password){
		return bcrypt.compareSync(password, user.password);
	}

	var createHash = function(password){
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	}
}