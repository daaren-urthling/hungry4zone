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
  function checkExistingImage(){
    if ($scope.imageName == '' || $scope.albumName == '' || !$scope.albums)
      return;
    var ext = '.JPG';
    if ($scope.fileName)
      ext = '.' + FireStorage.fileExt($scope.fileName);

    FireStorage.getImageURL({ albumId : $scope.albumName, imageId : $scope.imageName + ext }, FireStorage.SZ_SMALL).then(function success(result) {
      $scope.alert = { type : "warning", msg : "La foto esiste già, sarà sostituita."};
    }, function failure (response) {
      // image not found, correct
    });
  };

  FireStorage.getAlbumList().then(function success(albums) {
    $scope.albums = albums;
    checkExistingImage();
  }, function failure (response) {
    $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
  });  

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

    $scope.wait = true;
    FireStorage.uploadImage($scope.albumName, $scope.imageName, $scope.fileName, $scope.file).then( function success(result) {
      console.log(result);
      $scope.imagePickerInfo.imageCoord = result;
      SharedInfos.set("imagePickerInfo", imagePickerInfo);
      $timeout(function() {
        $location.url(imagePickerInfo.returnTo);
        $scope.wait = false;
      }, 2000); // need some timeout to create resized images      
    }, function failure (response) {
      $scope.wait = false;
      $scope.alert = { type : "danger", msg :GetErrorMessage(response) };
    });
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onCancelClicked = function(){
    $location.url($scope.imagePickerInfo && $scope.imagePickerInfo.returnTo ? $scope.imagePickerInfo.returnTo : '/');
  };


  //-----------------------------------------------------------------------------
  $scope.onAlbumNameChanged = function(){
    if ($scope.albumName == '' || !$scope.albums)
      return;
    var found = $scope.albums.find(element => { 
      return element.name == $scope.albumName.toLowerCase();
    });
    if (found) {
      $scope.alert = { type : "success", msg : "L'album esiste già, la foto sarà aggiunta."};
    }

  };

  //-----------------------------------------------------------------------------
  $scope.onImageNameChanged = function(){
    $scope.alert = null;
    checkExistingImage();
  };
    
  
}]);
