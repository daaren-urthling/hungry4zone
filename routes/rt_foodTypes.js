var express = require('express');
var router = express.Router();

/* GET food types listing. */
router.get('/', function(req, res, next) {
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
  res.json(foodTypes);
});

module.exports = router;
