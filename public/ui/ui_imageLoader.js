//=============================================================================
// ImageLoaderController - controller for ui_imageLoader.html
//=============================================================================

app.controller('ImageLoaderController', ['$scope', '$location', 'SharedInfos', 'FireStorage', '$timeout', function ($scope, $location, SharedInfos, FireStorage, $timeout) {
  $scope.albumName = '';
  $scope.imageName = '';
  $scope.fileName = '';
  $scope.wait = false;

  if (SharedInfos.has("imagePickerInfo"))  {
    $scope.imagePickerInfo = SharedInfos.get("imagePickerInfo");
    $scope.albumName = imagePickerInfo.name;
    $scope.imageName = imagePickerInfo.name;
  }

  //-----------------------------------------------------------------------------
  $scope.onFileChanged = function(element) {
      $scope.fileName = element.files[0].name;
      $scope.file = element.files[0];
      $scope.$apply();
  };

  //-----------------------------------------------------------------------------
  $scope.onUploadClicked = function() {
    if ($scope.fileName == '')
      return;

    FireStorage.uploadImage($scope.albumName, $scope.imageName, $scope.fileName, $scope.file).then( function success(result) {
      console.log(result);
      $scope.imagePickerInfo.imageCoord = result;
      SharedInfos.set("imagePickerInfo", imagePickerInfo);
      $scope.wait = true;
      $timeout(function() {
        $location.url(imagePickerInfo.returnTo);
        $scope.wait = false;
      }, 2000); // need some timeout to create resized images      
    }, function failure (response) {
      $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
    });
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
  
}]);
