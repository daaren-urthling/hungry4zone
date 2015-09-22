var express = require('express');
var mongoose = require('mongoose');
var DailyPlan = require('../models/md_dailyPlan.js');
var ApplicationError = require('../utils/applicationError.js');

var router = express.Router();

//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  DailyPlan.find(function (err, dailyPlans) {
    if (err) return next(err);
    res.json(dailyPlans);
  });
});

// save           (POST /)
//-----------------------------------------------------------------------------
router.post('/', function(req, res, next) {
  DailyPlan.exist(req.body.date, function(err, found, dailyPlan) {
    if (err)    return next(err);
    if (found)  return next(new ApplicationError("Planning già presente: " + req.body.date));

    DailyPlan.create(req.body, function (err, newDailyPlan) {
      if (err) return next(err);
      res.json(newDailyPlan._doc);
    });
  });
});

// update         (PUT /:id)
//-----------------------------------------------------------------------------
router.put('/:id', function(req, res, next) {
  DailyPlan.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, obj) {
    if (err) return next(err);
    if (obj === null)
      return next(new ApplicationError("Planning non trovato, id: " + req.params.id));
    res.json(obj._doc);
  });
});
