//=============================================================================
// SharedInfos service
//=============================================================================
app.service('SharedInfos', function() {
  var shared = {};

  shared.infos = [];

  function find(name) {
    for (i = 0; i < shared.infos.length; i++) {
      if (shared.infos[i].name == name)
        return i;
    }
    return -1;
  }

  shared.set = function(name, obj) {
    pos = find(name);
    if (pos >= 0)
      shared.infos[pos].obj = obj;
    else
      shared.infos.push({name: name, obj: obj});
  };

  shared.has = function(name) {
    return find(name) >= 0;
  };

  shared.get = function(name) {
    pos = find(name);
    if (pos >= 0)
    {
      ret = shared.infos[pos].obj;
      shared.infos.splice(pos, 1);
      return ret;
    }
    return null;
  };

  return shared;
});
