var express = require('express');
var mongoose = require('mongoose');
var Meal = require('../models/md_meal.js');
var ApplicationError = require('../utils/applicationError.js');

var router = express.Router();

//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  Meal.find(function (err, meals) {
    if (err) return next(err);
    res.json(meals);
  });
});

// search         (GET /search/:name)
//-----------------------------------------------------------------------------
router.get('/search/:name', function(req, res, next) {
  Meal.exist(req.params.name, function(err, found, meal) {
    if (err) return next(err);
    if (found)
      res.json(meal);
    else
      res.json({});
  });
});

// save           (POST /)
//-----------------------------------------------------------------------------
router.post('/', function(req, res, next) {
  Meal.exist(req.body.name, function(err, found, meal) {
    if (err)    return next(err);
    if (found)  return next(new ApplicationError("Pasto già presente: " + req.body.name));

    Meal.create(req.body, function (err, newMeal) {
      if (err) return next(err);
      res.json(newMeal._doc);
    });
  });
});
