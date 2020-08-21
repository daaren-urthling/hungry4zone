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
// Picasa service
//=============================================================================
app.service('Picasa', ['$http','$q', function($http, $q) {
  var picasa = {
    basePath : 'https://picasaweb.google.com/data/feed/api/user/105734972554056284073',
  };

  allowedSizes = {"94" : true, "110" : true, "128" : true, "200" : true, "220" : true, "288" : true, "320" : true, "400" : true, "512" : true, "576" : true, "640" : true, "720" : true,"800" : true, "912" : true, "1024" : true, "1152" : true,"1280" : true,"1440" : true, "1600" : true};

  //-----------------------------------------------------------------------------
  picasa.getAlbumList = function () {
    var defer = $q.defer();

    $http.jsonp(picasa.basePath + '?v=2&&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
      albumList = [];
      response.data.feed.entry.forEach(function (e) {
        albumList.push({ name: e.title.$t, id : e.gphoto$id.$t });
      });
      defer.resolve(albumList);
    }, function (response) {
      defer.reject(response);
    });

    return defer.promise;
  };

  //-----------------------------------------------------------------------------
  picasa.getImageList = function (album) {
    var defer = $q.defer();

    $http.jsonp(picasa.basePath + '/albumid/' + album.id + '?v=2&imgmax=200&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
      imageList = [];
      response.data.feed.entry.forEach(function (e) {
        imageList.push({ name: e.title.$t, caption: e.summary.$t, img : e.content.src, imageCoord : { albumId : e.gphoto$albumid.$t, imageId : e.gphoto$id.$t } });
      });
      defer.resolve(imageList);
    }, function (response) {
      defer.reject(response);
    });

    return defer.promise;
  };

  //-----------------------------------------------------------------------------
  picasa.getImageURL = function (imageCoord, size) {
    if (!imageCoord || !imageCoord.albumId || !imageCoord.imageId)
      throw "bad image parameters";
    if (!size)
      size = 200;
    if (!angular.isArray(size)) {
      if (!(size in allowedSizes))
        throw "bad requested size";
    } else {
      for (s = 0; s < size.length; s++) {
        if (!(size[s] in allowedSizes))
          throw "bad requested size";
      }
    }

    var defer = $q.defer();

    $http.jsonp(picasa.basePath + '/albumid/' + imageCoord.albumId + '/photoid/' + imageCoord.imageId + '?v=2&thumbsize='+size+'&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
        if (response.data.feed.media$group.media$thumbnail.length == 1) {
          defer.resolve(response.data.feed.media$group.media$thumbnail[0].url);
        } else {
          urls = [];
          for (i = 0; i < response.data.feed.media$group.media$thumbnail.length; i++)
            urls.push(response.data.feed.media$group.media$thumbnail[i].url);
          defer.resolve(urls);
        }
    }, function (response) {
        defer.reject(response);
    });

    return defer.promise;
  };

  return picasa;
}]);

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