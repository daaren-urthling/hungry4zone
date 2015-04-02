var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Food = require('../models/md_food.js');

/* GET /foods listing. */
router.get('/', function(req, res, next) {
  Food.find(function (err, foods) {
    if (err) return next(err);
    res.json(foods);
  });
});

/* GET /foods/id */
router.get('/:id', function(req, res, next) {
  Food.findById(req.params.id, function (err, food) {
    if (err) return next(err);
    res.json(food);
  });
});

/* GET /foods/name */
router.get('/search/:name', function(req, res, next) {
  //@@TODO la ricerca lower-case con le regexp non e` efficente
  Food.findOne({name : { $regex : new RegExp("^" + req.params.name + "$", "i") } }, function(err, food){
    if (err) return next(err);
    res.send({found : food !== null});
  });
});

/* POST /foods */
router.post('/', function(req, res, next) {
  Food.adjustLocale(req.body);

  Food.findOne({name : { $regex : new RegExp("^" + req.body.name + "$", "i") } }, function(err, food){
    if (err) return next(err);
    if (food === null)
      Food.create(req.body, function (err, food) {
        if (err) return next(err);
        res.json(food);
      });
    else
      res.send({found : true});
  });
});

/* PUT /foods/:id */
router.put('/:id', function(req, res, next) {
  Food.adjustLocale(req.body);

  Food.findByIdAndUpdate(req.params.id, req.body, function (err, food) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (food === null) return res.send('not found');
    res.json(food);
  });
});


 /* DELETE /foods/:id */
router.delete('/:id', function(req, res, next) {
  Food.findByIdAndRemove(req.params.id, req.body, function (err, food) {
    if (err) return next(err);
    res.json(food);
  });
});

module.exports = router;
