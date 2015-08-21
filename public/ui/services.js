//======================*=======================================================
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
app.service('Picasa', ['$http', function($http) {
  var picasa = {
    basePath : 'https://picasaweb.google.com/data/feed/api/user/105734972554056284073',
  };

  allowedSizes = {"94" : true, "110" : true, "128" : true, "200" : true, "220" : true, "288" : true, "320" : true, "400" : true, "512" : true, "576" : true, "640" : true, "720" : true,"800" : true, "912" : true, "1024" : true, "1152" : true,"1280" : true,"1440" : true, "1600" : true};

  //-----------------------------------------------------------------------------
  picasa.getAlbumList = function (success, failure) {
    $http.jsonp(picasa.basePath + '?v=2&&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
      if (success)
        albumList = [];
        response.data.feed.entry.forEach(function (e) {
          albumList.push({ name: e.title.$t, id : e.gphoto$id.$t });
        });
        success(albumList);
    }, function (response) {
      if (failure)
        failure(response);
    });
  };

  //-----------------------------------------------------------------------------
  picasa.getImageList = function (album, success, failure) {
    $http.jsonp(picasa.basePath + '/albumid/' + album.id + '?v=2&imgmax=200&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
      if (success)
        imageList = [];
        response.data.feed.entry.forEach(function (e) {
          imageList.push({ name: e.title.$t, caption: e.summary.$t, img : e.content.src, imageCoord : { albumId : e.gphoto$albumid.$t, imageId : e.gphoto$id.$t } });
        });
        success(imageList);
    }, function (response) {
      if (failure)
        failure(response);
    });
  };

  //-----------------------------------------------------------------------------
  picasa.getImageURL = function (a1, a2, a3, a4) {
    switch (arguments.length) {
      case 3: { imageCoord = a1; size = 200; success = a2; failure = a3; } break;
      case 4: { imageCoord = a1; size = a2; success = a3; failure = a4; } break;
      default : throw "Bad arguments number, expected [imageCoord, size, success, failure] or [imageCoord, success, failure]";
    }
    if (!(size in allowedSizes))
      return failure({data : "bad requested size"});
    $http.jsonp(picasa.basePath + '/albumid/' + imageCoord.albumId + '/photoid/' + imageCoord.imageId + '?v=2&thumbsize='+size+'&alt=json&callback=JSON_CALLBACK' ).then(function (response) {
      if (success)
        success(response.data.feed.media$group.media$thumbnail[0].url);
    }, function (response) {
      if (failure)
        failure(response);
    });
  };

  return picasa;
}]);
