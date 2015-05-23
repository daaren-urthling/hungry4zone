var express = require('express');
var router = express.Router();
var Result = require('../utils/result.js');

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
  if (req.body.idx >= meal.mealItems.length)
    meal.mealItems.push(req.body.item);
  else
    meal.mealItems[req.body.idx] = req.body.item;

  // send anyway an empty response to let the client store the cookie
  res.send(new Result(true, 0));
});

// removeItem         (put /removeItem)
//-----------------------------------------------------------------------------
router.put('/removeItem', function(req, res, next) {
  var meal = req.session.meal;
  if (meal && req.body.idx < meal.mealItems.length) {
    meal.mealItems.splice(req.body.idx,1);
  }
  // send anyway an empty response to let the client store the cookie
  res.send(new Result(true, 0));
});

// removeAll         (put /removeAll)
//-----------------------------------------------------------------------------
router.put('/removeAll', function(req, res, next) {
  if (req.session.meal) {
    req.session.meal = { mealItems : []};
  }
  // send anyway an empty response to let the client store the cookie
  res.send(new Result(true, 0));
});
