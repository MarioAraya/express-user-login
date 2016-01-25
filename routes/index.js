var express = require('express');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Por favor inicie sesión' });
});

router.get('/register', function(req, res, next) {
  res.render('registrar', { title: 'Crear una cuenta' });
});

router.get('/dashboard', function(req, res, next) {
	if(!req.user){
		console.log('.......... if(!req.user) true');
		req.flash('error', 'No has iniciado sesion');
		//res.render('login');
		res.render('login',{ title: 'Por favor inicia sesión' });
	}
	else {
		console.log('.......... if(!req.user) false');
		res.render('dashboard', { title: 'Dashboard', layout: 'dashboard_layout' });
	}  
});

router.get('/logout', function(req, res, next) { 
  req.logout();
  req.flash('success', 'Has cerrado sesión');

  res.redirect('/');
});

router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true
	})(req, res, next)
});


router.post('/register', function(req, res, next) {
	var name 		= req.body.name;
	var email		= req.body.email;
	var username	= req.body.username;
	var password  	= req.body.password;
	var password2 	= req.body.password2;

	//modulo: express-validator
	req.checkBody('name','Nombre es requerido').notEmpty();
	req.checkBody('email','Email es requerido').notEmpty();
	req.checkBody('email','').isEmail();
	req.checkBody('username','Nombre usuario es requerido').notEmpty();
	req.checkBody('password','Password es requerido').notEmpty();
	req.checkBody('password2','Passwords deben coincidir').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('registrar',{
			errors: errors
		});		
	} else {
		//res.send('Sin errores');
		passport.authenticate('local-register', {
			successRedirect: '/dashboard',
			failureRedirect: '/',
			failureFlash: true
		})(req, res, next)
	}
});

module.exports = router;
