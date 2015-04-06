//=============================================================================
// UploadController - controller for ui_upload.html
//=============================================================================

app.controller('UploadController', ['$scope', 'Foods', function ($scope, Foods) {

  //-----------------------------------------------------------------------------
  $scope.onFileChanged = function(element) {
    $scope.file = element.files[0];
  };

  //-----------------------------------------------------------------------------
  $scope.onUploadClicked = function() {
    var reader = new FileReader();
    reader.onload = function(onLoadEvent) {
      console.log('caricato ', this.result);
      Foods.upload({data: this.result}).
        success(function(data, status, headers, config) {
          console.log('posted');
        });
		};
    reader.readAsText($scope.file);
  };
}]);
