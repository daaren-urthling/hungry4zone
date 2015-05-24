//=============================================================================
// SharedInfo service
//=============================================================================
app.service('SharedInfo', function() {
  var info = {};

  var set = function(obj) { info = obj; };
  var get = function()    { return info;};

  return { set: set,  get: get  };
});
