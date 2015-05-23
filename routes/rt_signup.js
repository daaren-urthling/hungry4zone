var express = require('express');
var router = express.Router();
var Result = require('../utils/result.js');
var pass = require('pwd');
var User = require('../models/md_user.js');
var MailSender = require('../utils/mailSender.js');

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
  var email = req.body.email.toLowerCase();
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

  if (error.data)
    res.send(error);
  else
    User.exist(email, function(err, found, userId) {
      if (err) return next(err);
      if (!found) {
        pass.hash(password, function(err, salt, hash){
          if (err) return next(err);

          var user = {
            name: name,
            email: email,
            salt: salt,
            hash: hash
          };
          User.create(user, function (err, obj) {
            if (err) return next(err);
            MailSender.Welcome(name, email);
            req.session.loggedUser = name;
            res.send(new Result(true, 0, req.session.loggedUser));
          });
        });
      }
      else {
        error.data = "L'utente " + email + " è già presente.";
        res.send(error);
      }
    });
});

// check email          (POST /checkEmail)
//-----------------------------------------------------------------------------
router.post('/checkEmail', function(req, res, next) {
  var email = req.body.email.toLowerCase();
  User.exist(email, function(err, found, userId) {
    if (err) return next(err);
    if (!found) {
        res.send(new Result(true, 0));
    }
    else {
      res.send(new Result(false, userId));
    }
  });
});
