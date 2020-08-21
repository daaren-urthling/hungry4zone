//=============================================================================
// SharedInfos service
//=============================================================================
app.service('SharedInfos', function() {
  var shared = {};

  shared.infos = [];

  //-----------------------------------------------------------------------------
  function find(name) {
    for (i = 0; i < shared.infos.length; i++) {
      if (shared.infos[i].name == name)
        return i;
    }
    return -1;
  }

  //-----------------------------------------------------------------------------
  shared.set = function(name, obj) {
    pos = find(name);
    if (pos >= 0)
      shared.infos[pos].obj = obj;
    else
      shared.infos.push({name: name, obj: obj});
  };

  //-----------------------------------------------------------------------------
  shared.has = function(name) {
    return find(name) >= 0;
  };

  //-----------------------------------------------------------------------------
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

//=============================================================================
// MealTags service
//=============================================================================
app.service('MealTags', function() {
  var tags = [
    { "text": "Pasto" },
    { "text": "Spuntino" },
    { "text": "Colazione" },
    { "text": "Pranzo" },
    { "text": "Cena" },
    { "text": "Estivo" },
    { "text": "Invernale" },
  ];

  return tags;
});

//=============================================================================
// FireStorage service
//=============================================================================
app.service('FireStorage', ['$q', function($q) {
  var fireStorage = {
    SZ_SMALL: "_128x89",
    SZ_MEDIUM: "_200x142",
    SZ_LARGE: "_280x200"
  };

  function fileExt(fileName) {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
  }

  function baseName(fileName) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  //-----------------------------------------------------------------------------
  fireStorage.getAlbumList = function () {
    var defer = $q.defer();

    firebase.storage().ref().child('recipes/').listAll().then(function(res) {
      albumList = [];
      res.prefixes.forEach(prefix => {
        albumList.push({ name: prefix.name, id: prefix.name });
      });
      defer.resolve(albumList);
    }, function (response) {
      defer.reject(response);
    });    

    return defer.promise;
  };

  //-----------------------------------------------------------------------------
  fireStorage.getImageList = function (album) {
    var defer = $q.defer();

    firebase.storage().ref().child('recipes/' + album.id).listAll().then(function(res) {
      imageList = [];
      res.items.forEach(item => {
        var bn = baseName(item.name);
        if (bn.endsWith(fireStorage.SZ_LARGE) || bn.endsWith(fireStorage.SZ_MEDIUM) || bn.endsWith(fireStorage.SZ_SMALL))
          return;

        imageList.push({ 
          name: item.name, 
          caption: item.name, 
          imageCoord : { albumId : album.id, imageId : item.name } 
        });
      });
      defer.resolve(imageList);
    }, function (response) {
      defer.reject(response);
    });    

    return defer.promise;
  };

  //-----------------------------------------------------------------------------
  fireStorage.getImageURL = function (imageCoord, size) {
    if (size != fireStorage.SZ_LARGE && size != fireStorage.SZ_SMALL && size != fireStorage.SZ_MEDIUM)
      throw "bad requested size";
    var defer = $q.defer();

    var imageName = baseName(imageCoord.imageId) + size + '.' + fileExt(imageCoord.imageId); 

    var image = firebase.storage().ref('recipes/' + imageCoord.albumId + '/' + imageName); 
    image.getDownloadURL().then(function(url) {
      defer.resolve(url);
    }, function (response) {
      defer.reject(response);
    });

    return defer.promise;
  };

  return fireStorage;
}]);