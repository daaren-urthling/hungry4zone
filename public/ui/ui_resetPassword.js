//=============================================================================
// ResetPasswordController - controller for ui_resetPassword.html
//=============================================================================

app.controller('ResetPasswordController', ['$scope', 'Users', 'SharedInfo', function ($scope, Users, SharedInfo) {

  $scope.badPin = false;
  $scope.acceptedPin = false;

  if (SharedInfo.get().email)  {
    $scope.formData = { email : SharedInfo.get().email };
  }

  //-----------------------------------------------------------------------------
  $scope.onConfirmPinClicked = function(){
    if(!$scope.formData.pin || $scope.formData.pin.length < 1)
      return;

      Users.validatePin($scope.formData, function(result){
        $scope.badPin = false;
        if (result.success) {
          $scope.acceptedPin = true;
          $scope.formData.name = result.data.name;
          $scope.formData.id = result.id;
          $scope.formData.email = result.data.email;
        }
        else {
          $scope.badPin = true;
        }
      });
  };

  //-----------------------------------------------------------------------------
  $scope.onChangePasswordClicked = function(){

    if(!$scope.formData.password || $scope.formData.password.length < 1)
      return;

      Users.changePassword($scope.formData, function(result){
        if (result.success) {
          $scope.sentEmail = true;
        }
        else {
          $scope.errors = true;
        }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.$on("$destroy", function(){
    if ($scope.formData)
      SharedInfo.set($scope.formData);
  });

}]);
