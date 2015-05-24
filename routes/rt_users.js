var express = require('express');
var router = express.Router();
var Result = require('../utils/result.js');
var pass = require('pwd');
var User = require('../models/md_user.js');
var MailSender = require('../utils/mailSender.js');

//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  // not yet
  res.send(new Result(false, 0));
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
          User.create(user, function (err, doc) {
            if (err) return next(err);
            MailSender.Welcome(email, name, function(err, info){
              loggedUser = { id : doc._id, name : doc.name, isAdmin: doc.isAdmin, email : doc.email};
              req.session.loggedUser = loggedUser;
              result = new Result(true, 0, req.session.loggedUser);
              if (err){
                  console.log(err);
                  result.mailError = true;
              }
              res.send(result);
            });
          });
        });
      }
      else {
        error.data = "L'utente " + email + " è già presente.";
        res.send(error);
      }
    });
});

// checkEmail          (PUT /checkEmail)
//-----------------------------------------------------------------------------
router.put('/checkEmail', function(req, res, next) {
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

// loggedUser          (PUT /loggedUser)
//-----------------------------------------------------------------------------
router.put('/loggedUser', function(req, res, next) {
  if (req.body.logout) {
    req.session.loggedUser = null;
    res.send(new Result(true, 0));
  }
  else {
    if (req.session.loggedUser)
      res.send(new Result(true, 0, req.session.loggedUser));
    else
      res.send(new Result(false, 0));
  }
});

// login         (PUT /login)
//-----------------------------------------------------------------------------
router.put('/login', function(req, res, next) {
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    var error = new Result(false, 0);

    // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

    // check for valid inputs
    if (!email || !password) {
      error.data = 'Inserire tutti i campi richiesti.';
    } else if (!email.match(EMAIL_REGEXP)) {
      error.data = 'L\'indirizzo e-mail non è valido.';
    }

    if (error.data)
      res.send(error);
    else
      User.findOne({ email : email }, function(err, doc) {
        if (doc !== null) {
          pass.hash(password, doc.salt, function(err, hash) {
            if (doc.hash === hash) {
              if (err) return next(err);

              // reset any attempt of password recovery
              //User.findByIdAndUpdate(obj._doc._id, {resetPin : ""}, function (err, obj) {});
              doc.resetPin = "";
              doc.save(function (err, obj) {});

              loggedUser = { id : doc._id, name : doc.name, isAdmin: doc.isAdmin, email : doc.email};
              req.session.loggedUser = loggedUser;
              res.send(new Result(true, loggedUser.id, loggedUser));
            }
            else
              res.send(new Result(false, 0));
          });
        }
        else
          res.send(new Result(false, 0));
      });

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
  if (!req.body.email) {
    res.send(new Result(false, 0));
  }

  User.findOne({ email : req.body.email }, function(err, obj) {
    if (obj !== null) {
      var pin = generatePin();
      User.findByIdAndUpdate(obj._doc._id, {resetPin : pin}, function (err, obj) {
        if (err) return next(err);
        if (obj === null)
          return res.send(new Result(false, 0));

        MailSender.ResetPassword(req.body.email, pin, function(err, info) {
          if (err)
            res.send(err);
          else
            res.send(new Result(true, 0));
        });
      });
    }
    else
    {
      MailSender.UnknownResetRequest(req.body.email);
      res.send(new Result(false, 0));
    }
  });

});

// validatePin          (PUT /validatePin)
//-----------------------------------------------------------------------------
router.put('/validatePin', function(req, res, next) {
  if (!req.body.pin) {
    res.send(new Result(false, 0));
    return;
  }

  User.findOne({ resetPin : req.body.pin }, function(err, doc) {
    if (doc !== null)
      res.send(new Result(true, doc._id, { name : doc.name, email : doc.email }));
    else
      res.send(new Result(false, 0));

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
        if (err)
          res.send(new Result(false, 0));
        else
        {
          MailSender.ChangedPassword(doc.email, doc.name);
          res.send(new Result(true, 0));
        }
      });
    });
  });
});
