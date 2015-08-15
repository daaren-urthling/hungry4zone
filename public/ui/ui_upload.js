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
      Foods.upload({data: this.result}, function(result) {
        $scope.alert = { type : "success", msg :"caricati " + result.uploaded.length + " alimenti" };
        console.log('posted: ' + result.uploaded);
      }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
      });
		};
    reader.readAsText($scope.file);
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
  
}]);
