var mongoose = require('mongoose');

var DailyMealsSchema = new mongoose.Schema({
  date   : Date,
  meals  : [ { kind : String, meal : { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } } ],
  notes  : String
});

var DailyMeals = mongoose.model('DailyMeals', DailyMealsSchema);
//=============================================================================
module.exports = DailyMeals;
