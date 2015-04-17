var express = require('express');
var router = express.Router();
var Result = require('../models/result.js');

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
router.get('/loggedUser', function(req, res, next) {
  if (req.session.loggedUser)
    res.send(new Result(true, 0, req.session.loggedUser));
  else
    res.send(new Result(false, 0));
});

// login         (GET /login)
//-----------------------------------------------------------------------------
router.put('/login', function(req, res, next) {
    var loggedUser = { username : req.body.username, isAdmin : false };
    var success = false;

    if (loggedUser.username === "admin")
    {
      if(req.body.password === "pucci98")
      {
        loggedUser.isAdmin = true;
        success = true;
      }
      else
        success = false;
    }
    else
      success = true;

    if (success)
    {
      req.session.loggedUser = loggedUser;
      res.send(new Result(true, 0, loggedUser));
    }
    else
      res.send(new Result(false, 0));

});
