var mongoose = require('mongoose');

var FoodSchema = new mongoose.Schema({
  name          : String,
  type          : String,
  source        : Number,
  proteins      : Number,
  fats          : Number,
  carbohydrates : Number
});

module.exports = mongoose.model('Food', FoodSchema);
