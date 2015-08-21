//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'SharedInfos', '$sessionStorage', 'Picasa', '$location', function ($scope, SharedInfos, $sessionStorage, Picasa, $location) {

  // if (SharedInfos.has("cache.PlannerController")){
  //   $scope.items = SharedInfos.get("cache.PlannerController");
  // }
  // SharedInfos.set("cache.PlannerController", $scope.items);

  if ($sessionStorage.items) {
    $scope.items = $sessionStorage.items;
  } else {
    $scope.items = [];
    $sessionStorage.items =  $scope.items;
  }

  if (SharedInfos.has("imagePickerInfo"))  {
    imagePickerInfo = SharedInfos.get("imagePickerInfo");
    Picasa.getImageURL(imagePickerInfo.imageCoord, 288, function success(imageUrl) {
      $scope.img = imageUrl;
    }, function failure(response) {
      console.log(response);
    });
  }


  // $http.defaults.useXDomain = true;

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $scope.items.push({ a : 0, b : "ciao "});
  };

  //-----------------------------------------------------------------------------
  $scope.onInspectClicked = function(){
    // if (SharedInfos.has("cache.PlannerController"))
    //   itm = SharedInfos.get("cache.PlannerController");
    //   SharedInfos.set("cache.PlannerController", itm);
    if ($sessionStorage.items)
      itm = $sessionStorage.items;
  };

  $scope.albums = [];
  //-----------------------------------------------------------------------------
  $scope.onAlbumClicked = function(){
    // $http.get('https://picasaweb.google.com/data/feed/api/user/105734972554056284073').then(function success (result) {
    // $http.get('https://picasaweb.google.com/data/feed/api/user/105734972554056284073/albumid/5749722873821751473').then(function success (result) {
    // $http.jsonp('https://picasaweb.google.com/data/feed/api/user/105734972554056284073/albumid/5749722873821751473' + '?alt=json&kind=photo&hl=pl&imgmax=912&callback=JSON_CALLBACK').then(function success (result) {
    // $http.jsonp('https://picasaweb.google.com/data/feed/api/user/105734972554056284073/albumid/5749722873821751473' + '?v=2&imgmax=200&alt=json&callback=JSON_CALLBACK' ).then(function success (result) {
    //   var res = result;
    //   $scope.img = res.data.feed.entry[0].content.src;
    //   $scope.caption = res.data.feed.entry[0].summary.$t;
    // }, function failure (result) {
    //   console.log(result);
    // });
    Picasa.getAlbumList(function success(result) {
      $scope.albums = result;
    }, function failure (result) {

    });

  };

  //-----------------------------------------------------------------------------
  $scope.onPickImageClicked = function(){
    SharedInfos.set("imagePickerInfo", { returnTo : "/planner" });
    $location.url('/imagePicker');
  };

}]);
