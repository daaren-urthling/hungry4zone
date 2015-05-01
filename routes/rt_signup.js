var express = require('express');
var router = express.Router();
var Result = require('../models/result.js');
var pass = require('pwd');

//=============================================================================
module.exports = router;

// render          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  return next();
});

// signup          (POST /)
//-----------------------------------------------------------------------------
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var verification = req.body.verification;
  var name = "";
  if (req.body.name)
    name = req.body.name;
  else
    name = req.body.email;

  var error = new Result(false, 0);

  // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  // check for valid inputs
  if (!email || !password || !verification) {
    error.data = 'Inserire tutti i campi richiesti.';
  } else if (!email.match(EMAIL_REGEXP)) {
    error.data = 'L\'indirizzo e-mail non è valido.';
  } else if (password !== verification) {
    error.data = 'Le due password non corrispondono.';
  }

  if (email === "andrea_rinaldi@hotmail.it")
    error.data = "L'utente " + email + " è già presente.";

  if (error.data)
    res.send(error);
  else
  {
    // create salt and hash password
    pass.hash(password, function(err, salt, hash){
      if (err) console.log(err);

      var user = {
        name: name,
        email: email,
        salt: salt,
        hash: hash,
        createdAt: Date.now()
      };

      req.session.loggedUser = name;

      res.send(new Result(true, 0, req.session.loggedUser));
    });
  }

/*
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var verification = req.body.verification;

  var error = null;
  // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  // check for valid inputs
  if (!username || !email || !password || !verification) {
    error = 'All fields are required';
  } else if (username !== encodeURIComponent(username)) {
    error = 'Username may not contain any non-url-safe characters';
  } else if (!email.match(EMAIL_REGEXP)) {
    error = 'Email is invalid';
  } else if (password !== verification) {
    error = 'Passwords don\'t match';
  }

  if (error) {
    response.status(403);
    response.render('signup', {
      error: error
    });
    return
  }

  // check if username is already taken
  for (var i = 0; i < dummyDb.length; i++) {
    if (dummyDb[i].username === username) {
      response.status(403);
      response.render('signup', {
        error: 'Username is already taken'
      });
      return;
    }
  }

  // create salt and hash password
  pass.hash(password, function(err, salt, hash){
    if (err) console.log(err);

    // yeah we have a new user
    var user = {
      username: username,
      email: email,
      salt: salt,
      hash: hash,
      createdAt: Date.now()
    };

    // for fully featured example check duplicate email, send verification link and save user to db

    res.send(new Result(true, 0));
  });
  */

});
