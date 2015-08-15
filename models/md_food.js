var mongoose = require('mongoose');

var FoodSchema = new mongoose.Schema({
  name          : String,
  type          : String,
  source        : Number,
  proteins      : Number,
  fats          : Number,
  carbohydrates : Number
});

var Food = mongoose.model('Food', FoodSchema);
//=============================================================================
module.exports = Food;

//-----------------------------------------------------------------------------
Food.adjustLocale = function (food) {

  function adjustNumberLocale(literal) {
    if (!literal) return 0.0;
    if (typeof(literal) == "number") return literal;
    if (typeof(literal) != "string") return 0.0;
    return literal.replace(',','.');
  }

  food.proteins = adjustNumberLocale(food.proteins);
  food.fats = adjustNumberLocale(food.fats);
  food.carbohydrates = adjustNumberLocale(food.carbohydrates);
};

//-----------------------------------------------------------------------------
function quote(regex) {
  return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

//-----------------------------------------------------------------------------
//@@TODO la ricerca lower-case con le regexp non e` efficente
Food.exist = function (foodName, callback) {
  var quoted = quote(foodName);
  this.findOne({name : { $regex : new RegExp("^" + quoted + "$", "i") } }, function(err, obj){
    callback(err, obj !== null, obj && obj._doc);
  });
};
