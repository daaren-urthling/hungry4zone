var mongoose = require('mongoose');

var MealSchema = new mongoose.Schema({
  name          : String,
  mealItems     : [ { foodId : mongoose.Schema.Types.ObjectId, qty : Number } ],
  totCalories   : Number,
  userId        : mongoose.Schema.Types.ObjectId
});

var Meal = mongoose.model('Meal', MealSchema);
//=============================================================================
module.exports = Meal;

//-----------------------------------------------------------------------------
function quote(regex) {
  return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

//-----------------------------------------------------------------------------
//@@TODO la ricerca lower-case con le regexp non e` efficente
Meal.exist = function (mealName, callback) {
  var quoted = quote(mealName);
  this.findOne({name : { $regex : new RegExp("^" + quoted + "$", "i") } }, function(err, obj){
    callback(err, obj !== null, obj && obj._doc._id);
  });
};
