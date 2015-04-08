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

// login         (GET /login)
//-----------------------------------------------------------------------------
router.put('/login', function(req, res, next) {
    if (req.body.username === "admin")
    {
      if(req.body.password === "pucci98")
        res.send(new Result(true, 0, {isAdmin : true}));
      else
        res.send(new Result(false, 0));
    }
    else
      res.send(new Result(true, 0, {isAdmin : false}));
});
