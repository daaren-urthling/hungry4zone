var express = require('express');
var router = express.Router();
var Result = require('../models/result.js');

//=============================================================================
module.exports = router;

// cacheRetrieve          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  if (!req.session.meal)
    res.send(new Result(false, 0));
  else
    res.send(new Result(true, 0, req.session.meal));
});

// cacheItem         (put /cacheItem)
//-----------------------------------------------------------------------------
router.put('/cacheItem', function(req, res, next) {
  var meal = req.session.meal;
  if (!meal) {
    meal = req.session.meal = { mealItems : []};
  }
  meal.mealItems.push(req.body);

  // send anyway an empty response to let the client store the cookie
  res.send(new Result(true, 0));
});
