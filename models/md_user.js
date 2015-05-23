var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name      : String,
  email     : String,
  salt      : String,
  hash      : String,
  created   : { type: Date, default: Date.now },
  isAdmin   : { type: Boolean, default: false },
  resetPin  : String
});

var User = mongoose.model('User', UserSchema);
//=============================================================================
module.exports = User;

//-----------------------------------------------------------------------------
User.exist = function (email, callback) {
  this.findOne({ email : email }, function(err, obj){
    callback(err, obj !== null, obj && obj._doc._id);
  });
};
