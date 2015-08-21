//=============================================================================
// ImagePickerController - controller for ui_imagePicker.html
//=============================================================================

app.controller('ImagePickerController', ['$scope', 'Picasa', '$location', 'SharedInfos', function ($scope, Picasa, $location, SharedInfos) {

  $scope.albums = [];

  $scope.albumIdx = -1;
  $scope.imageIdx = -1;

  $scope.selectedImage = {};

  if (SharedInfos.has("imagePickerInfo"))  {
    imagePickerInfo = SharedInfos.get("imagePickerInfo");
  }
  else {
    imagePickerInfo = { returnTo : "/" };
  }

  Picasa.getAlbumList(function success(result) {
      $scope.albums = result;
    }, function failure (response) {
      $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
  });

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
    Picasa.getImageList(album, function success(result) {
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
