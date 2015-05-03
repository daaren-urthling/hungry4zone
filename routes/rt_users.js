var express = require('express');
var router = express.Router();
var Result = require('../models/result.js');
var pass = require('pwd');
var User = require('../models/md_user.js');

//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  // not yet
  res.send(new Result(false, 0));
});

// loggedUser          (GET /loggedUser)
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

// login         (GET /login)
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
      User.findOne({ email : email }, function(err, obj) {
        if (obj !== null) {
          pass.hash(password, obj._doc.salt, function(err, hash) {
            if (obj._doc.hash === hash) {
              if (err) return next(err);
              loggedUser = { id : obj._doc._id, name : obj._doc.name, isAdmin: obj._doc.isAdmin, email : obj._doc.email};
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
