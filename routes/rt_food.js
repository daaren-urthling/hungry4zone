var express = require('express');
var promise = require('promise');
var mongoose = require('mongoose');
var Food = require('../models/md_food.js');
var Result = require('../models/result.js');

var router = express.Router();


//=============================================================================
module.exports = router;

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  Food.find(function (err, foods) {
    if (err) return next(err);
    res.json(foods);
  });
});

// get            (GET /:id)
//-----------------------------------------------------------------------------
router.get('/:id', function(req, res, next) {
  Food.findById(req.params.id, function (err, food) {
    if (err) return next(err);
    res.json(food);
  });
});

// search         (GET /search/:name)
//-----------------------------------------------------------------------------
router.get('/search/:name', function(req, res, next) {
  Food.exist(req.params.name, function(err, found, foodId) {
    if (err) return next(err);
    res.send(new Result(found, foodId));
  });
});

// save           (POST /)
//-----------------------------------------------------------------------------
router.post('/', function(req, res, next) {
  Food.adjustLocale(req.body);

  Food.exist(req.body.name, function(err, found, foodId) {
    if (err) return next(err);
    if (!found)
      Food.create(req.body, function (err, obj) {
        if (err) return next(err);
        res.send(new Result(true, obj._doc._id));
      });
    else
      res.send(new Result(false, foodId));
  });
});

// update         (PUT /:id)
//-----------------------------------------------------------------------------
router.put('/:id', function(req, res, next) {
  Food.adjustLocale(req.body);

  Food.findByIdAndUpdate(req.params.id, req.body, function (err, obj) {
    if (err) return next(err);
    if (obj === null)
      return res.send(new Result(false, req.params.id));
    res.send(new Result(true, obj._doc._id));
  });
});


 // remove        (DELETE /:id)
 //-----------------------------------------------------------------------------
router.delete('/:id', function(req, res, next) {
  Food.findByIdAndRemove(req.params.id, req.body, function (err, obj) {
    if (err) return next(err);
    res.send(new Result(true, req.params.id));
  });
});

//-----------------------------------------------------------------------------
function csvToJSON(csv) {
  var lines = csv.split("\r\n");
  var result = [];
  var headers = lines[0].split(";");
  delete lines[0];
  lines.forEach(function(line){
    var obj = {};
    var values = line.split(";");
    values.forEach(function(value,index) {
      obj[headers[index]] = value;
    });
    if (obj.name && obj.name.length > 0)
      result.push(obj);
  });
  return result;
}

// upload          (POST /upload)
//-----------------------------------------------------------------------------
router.post('/upload', function(req, res, next) {
  var foods = csvToJSON(req.body.data);
  var promises = foods.map(function(food) {
    return new promise(function (fulfill, reject){
      Food.adjustLocale(food);

      Food.exist(food.name, function(err, found, foodId) {
        if (err) reject(err);
        if (found)
          Food.findByIdAndUpdate(foodId, food, function (err, obj) {
            if (err) reject(err);
            fulfill(new Result(obj !== null, foodId));
        });
        else
          Food.create(food, function (err, obj) {
            if (err) reject(err);
            fulfill(new Result(true, obj._doc._id));
          });
      });
    });
  });
  promise.all( promises ).then( function(uploadResults) {
      res.send(uploadResults);
  },
  function(err) {
      return next(err);
  });
});
