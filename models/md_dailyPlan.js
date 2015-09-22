var mongoose = require('mongoose');

var DailyPlanSchema = new mongoose.Schema({
  date   : Date,
  meals  : [ { kind : String, meal : { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' } } ],
  notes  : String
});

var DailyPlan = mongoose.model('DailyPlan', DailyPlanSchema);
//=============================================================================
module.exports = DailyPlan;

//-----------------------------------------------------------------------------
DailyPlan.exist = function (date, callback) {
  this.findOne({date : date}, function(err, obj){
    callback(err, obj !== null, obj && obj._doc);
  });
};
