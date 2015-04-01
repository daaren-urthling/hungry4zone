var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Food = require('../models/md_food.js');

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

/* POST /uploadFoods */
router.post('/', function(req, res, next) {
  var foods = csvToJSON(req.body.data);
  foods.forEach(function(food) {
    console.log(food);
    Food.adjustLocale(food);
    console.log(food);
  });
  Food.create(foods[0], function (err, food) {
    if (err) {
      console.log(err);
      return next(err);
    }
  });
  // Food.adjustLocale(req.body);
  //
  // Food.create(req.body, function (err, food) {
  //   if (err) return next(err);
  //   res.json(food);
  // });
  res.send('done');
});

module.exports = router;
