//=============================================================================
// ImagePickerController - controller for ui_imagePicker.html
//=============================================================================

app.controller('ImagePickerController', ['$scope', 'Picasa', '$location', 'SharedInfos', function ($scope, Picasa, $location, SharedInfos) {

  $scope.albums = [];
  $scope.images = [];

  $scope.albumIdx = -1;
  $scope.albumName = "";
  $scope.imageIdx = -1;

  $scope.selectedImage = {};

  if (SharedInfos.has("imagePickerInfo"))  {
    imagePickerInfo = SharedInfos.get("imagePickerInfo");
  }
  else {
    imagePickerInfo = { returnTo : "/" };
  }

  Picasa.getAlbumList().then(function success(albums) {
    $scope.albums = albums;
  }, function failure (response) {
    $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
  });

  $scope.currentPage = 1;
  $scope.itemsPerPage = 15;
  $scope.firstVisibleItem = 0;

  //-----------------------------------------------------------------------------
  $scope.onPageChanged = function() {
    $scope.firstVisibleItem = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.albumIdx = -1;
    $scope.imageIdx = -1;
  };

  //-----------------------------------------------------------------------------
  $scope.albumRowClass = function($index){
    if ($index == $scope.albumIdx)
      return "list-group-item h4z-small-list-group-item active";
    else
      return "list-group-item h4z-small-list-group-item";
  };

  //-----------------------------------------------------------------------------
  $scope.imageRowClass = function($index){
    if ($index == $scope.imageIdx)
      return "list-group-item active";
    else
      return "list-group-item";
  };

  //-----------------------------------------------------------------------------
  $scope.onAlbumClicked = function($index, album){
    $scope.albumIdx = $index;
    $scope.albumName = ": " + album.name;
    Picasa.getImageList(album).then(function success(result) {
        $scope.images = result;
        $scope.imageIdx = -1;
      }, function failure (response) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onImageClicked = function($index, image){
    $scope.imageIdx = $index;
    $scope.selectedImage = image;
  };

  //-----------------------------------------------------------------------------
  $scope.onOkClicked = function(){
    imagePickerInfo.imageCoord = $scope.selectedImage.imageCoord;
    SharedInfos.set("imagePickerInfo", imagePickerInfo);
    $location.url(imagePickerInfo.returnTo);
  };

  //-----------------------------------------------------------------------------
  $scope.onCancelClicked = function(){
    $location.url(imagePickerInfo.returnTo);
  };

}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});