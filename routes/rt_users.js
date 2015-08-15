var express = require('express');
var router = express.Router();
var pass = require('pwd');
var User = require('../models/md_user.js');
var MailSender = require('../utils/mailSender.js');
var ApplicationError = require('../utils/applicationError.js');

//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  // not yet
  res.send({});
});

// signup          (PUT /signup)
//-----------------------------------------------------------------------------
router.put('/signup', function(req, res, next) {
  var email = req.body.email.toLowerCase();
  var password = req.body.password;
  var verification = req.body.verification;
  var name = "";
  if (req.body.name)
    name = req.body.name;
  else
    name = req.body.email;

  var error = null;

  // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  // check for valid inputs
  if (!email || !password || !verification) {
    error = new ApplicationError('Inserire tutti i campi richiesti.');
  } else if (!email.match(EMAIL_REGEXP)) {
    error = new ApplicationError('L\'indirizzo e-mail non è valido.');
  } else if (password !== verification) {
    error = new ApplicationError('Le due password non corrispondono.');
  }

  if (error)
    return next (error);

  User.exist(email, function(err, found, userId) {
    if (err)    return next(err);
    if (found)  return next(new ApplicationError("L'utente " + email + " è già presente."));

    pass.hash(password, function(err, salt, hash){
      if (err) return next(err);

      var user = {
        name: name,
        email: email,
        salt: salt,
        hash: hash
      };
      User.create(user, function (err, doc) {
        if (err) return next(err);
        MailSender.Welcome(email, name, function(err, info){
          if (err) console.log(err); // do no stop, just inform the user
          req.session.loggedUser = { id : doc._id, name : doc.name, isAdmin: doc.isAdmin, email : doc.email};
          res.json({loggedUser : req.session.loggedUser, mailError : err !== null});
        });
      });
    });
  });
});

// checkEmail          (PUT /checkEmail)
//-----------------------------------------------------------------------------
router.put('/checkEmail', function(req, res, next) {
  var email = req.body.email.toLowerCase();
  User.exist(email, function(err, found, userId) {
    if (err) return next(err);
    res.json({isTaken : found});
  });
});

// loggedUser          (PUT /loggedUser)
//-----------------------------------------------------------------------------
router.put('/loggedUser', function(req, res, next) {
  if (req.session.loggedUser)
    res.json(req.session.loggedUser);
  else
    res.json({});
});

// login         (PUT /login)
//-----------------------------------------------------------------------------
router.put('/login', function(req, res, next) {
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    var error = null;

    // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

    // check for valid inputs
    if (!email || !password) {
      error = new ApplicationError('Inserire tutti i campi richiesti.');
    } else if (!email.match(EMAIL_REGEXP)) {
      error = new ApplicationError('L\'indirizzo e-mail non è valido.');
    }

    if (error)
      return next(error);

    User.findOne({ email : email }, function(err, doc) {
      badData = new ApplicationError("L'indirizzo e-mail e la password non corrispondono.");
      if (doc === null) return next(badData);

      pass.hash(password, doc.salt, function(err, hash) {
        if (err)                return next(err);
        if (doc.hash !== hash)  return next(badData);

        // reset any attempt of password recovery
        doc.resetPin = "";
        doc.save(function (err, obj) {});

        req.session.loggedUser = { id : doc._id, name : doc.name, isAdmin: doc.isAdmin, email : doc.email};
        res.json(req.session.loggedUser);
      });
    });

});

// logout          (PUT /logout)
//-----------------------------------------------------------------------------
router.put('/logout', function(req, res, next) {
    req.session.loggedUser = null;
    res.json({});
});

//-----------------------------------------------------------------------------
function generatePin() {
  var pin = '' + Math.floor((Math.random() * 1000000) + 1);
  while (pin.length < 6) pin = '0' + pin;
  return pin;
}

// forgotPassword          (PUT /forgotPassword)
//-----------------------------------------------------------------------------
router.put('/forgotPassword', function(req, res, next) {
  if (!req.body.email) return next(new ApplicationError("Indicare un indirizzo e-mail valido."));

  User.findOne({ email : req.body.email }, function(err, obj) {
    if (obj !== null) {
      var pin = generatePin();
      User.findByIdAndUpdate(obj._doc._id, {resetPin : pin}, function (err, obj) {
        if (err)          return next(err);
        if (obj === null) return next(new ApplicationError("Impossibile recuperare la password ora."));

        MailSender.ResetPassword(req.body.email, pin, function(err, info) {
          if (err) return next(err);
          res.json({}); // success
        });
      });
    }
    else
    {
      MailSender.UnknownResetRequest(req.body.email,function(err, info) {
        if (err) return next(err);
        res.json({}); // even if the mail was not found among the registered users, behave like it was a success
    });
    }
  });

});

// validatePin          (PUT /validatePin)
//-----------------------------------------------------------------------------
router.put('/validatePin', function(req, res, next) {
  if (!req.body.pin) return next(new ApplicationError("Indicare il pin ricevuto via e-mail."));

  User.findOne({ resetPin : req.body.pin }, function(err, doc) {
    if (doc === null) return next(new ApplicationError("Pin errato."));

    res.json({ id : doc._id, name : doc.name, isAdmin: doc.isAdmin, email : doc.email});
  });

});

// changePassword          (PUT /changePassword)
//-----------------------------------------------------------------------------
router.put('/changePassword', function(req, res, next) {
  User.findById(req.body.id, function (err, doc) {
    if (err) return next(err);
    pass.hash(req.body.password, function(err, salt, hash){
      if (err) return next(err);
      doc.salt      = salt;
      doc.hash      = hash;
      doc.resetPin  = ""; // reset pin is no longer valid
      doc.save(function (err, obj) {
        if (err) return next(new ApplicationError("Errore nel tentativo di reset della password."));
        MailSender.ChangedPassword(doc.email, doc.name, function(err, info){
          if (err){
              res.json({ mailError : true}); // password successfully reset even if the mail was not sent
              console.log(err);
          } else {
            res.json({ mailError : false});
          }
        });
      });
    });
  });
});
