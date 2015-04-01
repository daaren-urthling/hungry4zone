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

module.exports = Food;
