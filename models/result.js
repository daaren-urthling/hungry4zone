var Result = function (success, id, data) {
  this.success = success;
  this.id = id;
  if (typeof data !== "undefined" && data !== null)
    this.data= data;
};

//=============================================================================
module.exports = Result;
