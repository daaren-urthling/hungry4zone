//=============================================================================
// ResetPasswordController - controller for ui_resetPassword.html
//=============================================================================

app.controller('ResetPasswordController', ['$scope', 'Users', 'SharedInfos', function ($scope, Users, SharedInfos) {

  $scope.badPin = false;
  $scope.acceptedPin = false;
  $scope.changedPassword = false;
  $scope.errors = false;
  $scope.sentEmail = true;

  if (SharedInfos.has("email"))  {
    $scope.formData = { email : SharedInfos.get("email") };
  }

  if (SharedInfos.has("forwardAddress")) {
    $scope.forwardAddress = SharedInfos.get("forwardAddress");
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
        $scope.changedPassword = true;
        if (result.success) {
          $scope.errors = false;
          $scope.sentEmail = !result.mailError;
        }
        else {
          $scope.errors = true;
          $scope.sentEmail = false;
        }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){
    if ($scope.forwardAddress)
      SharedInfos.set("forwardAddress", $scope.forwardAddress);

    $location.url("/login");
  };

  //-----------------------------------------------------------------------------
  $scope.$on("$destroy", function(){
    if ($scope.formData && $scope.formData.email)
      SharedInfos.set("email", $scope.formData.email);
  });

}]);
