var express = require('express');
var router = express.Router();
var Result = require('../models/result.js');

//=============================================================================
module.exports = router;

var foodTypes = [
  { type : "carne", proteineAbsorption : 100 },
  { type : "cereali", proteineAbsorption : 	40 },
  { type : "frutta", proteineAbsorption : 	30 },
  { type : "funghi", proteineAbsorption : 	50 },
  { type : "grassi", proteineAbsorption : 	100 },
  { type : "latticini", proteineAbsorption : 	100 },
  { type : "legumi", proteineAbsorption : 	68 },
  { type : "noci", proteineAbsorption : 	52 },
  { type : "ortaggi", proteineAbsorption : 	50 },
  { type : "pesce", proteineAbsorption : 	100 },
  { type : "soia", proteineAbsorption : 	100 },
  { type : "uova", proteineAbsorption : 	100 },
];

//-----------------------------------------------------------------------------
function find(type) {
  for (i = 0; i < foodTypes.length; i++) {
    if (foodTypes[i].type == type)
      return foodTypes[i];
  }
  return null;
}

// query          (GET /)
//-----------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  res.json(foodTypes);
});

// get            (GET /:id)
//-----------------------------------------------------------------------------
router.get('/:id', function(req, res, next) {
  var foodType = find(req.params.id);

  if (foodType)
    res.send(new Result(true, req.params.id, foodType));
  else
    res.send(new Result(false, req.params.id));
});
