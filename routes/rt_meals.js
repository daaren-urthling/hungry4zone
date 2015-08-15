var express = require('express');
var mongoose = require('mongoose');
var Meal = require('../models/md_meal.js');
var ApplicationError = require('../utils/applicationError.js');

var router = express.Router();

//=============================================================================
module.exports = router;

// save           (POST /)
//-----------------------------------------------------------------------------
router.post('/', function(req, res, next) {
  Meal.exist(req.body.name, function(err, found, meal) {
    if (err) return next(err);
    if (!found)
      Meal.create(req.body, function (err, newMeal) {
        if (err) return next(err);
        res.json(newMeal._doc);
      });
    else
      res.send(new ApplicationError("Pasto già presente: " + req.body.name));
  });
});

// cacheRetrieve          (GET /cacheRetrieve)
//-----------------------------------------------------------------------------
router.get('/cacheRetrieve', function(req, res, next) {
  if (!req.session.meal)
    res.json({});
  else
    res.json(req.session.meal);
});

// cacheItem         (PUT /cacheItem)
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
  res.json({});
});

// removeCachedItem         (PUT /removeCachedItem)
//-----------------------------------------------------------------------------
router.put('/removeCachedItem', function(req, res, next) {
  var meal = req.session.meal;
  if (meal && req.body.idx < meal.mealItems.length) {
    meal.mealItems.splice(req.body.idx,1);
  }
  // send anyway an empty response to let the client store the cookie
  res.json({});
});

// removeAllCache         (PUT /removeAllCache)
//-----------------------------------------------------------------------------
router.put('/removeAllCache', function(req, res, next) {
  if (req.session.meal) {
    req.session.meal = { mealItems : []};
  }
  // send anyway an empty response to let the client store the cookie
  res.json({});
});
