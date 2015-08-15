//=============================================================================
// ResetPasswordController - controller for ui_resetPassword.html
//=============================================================================

app.controller('ResetPasswordController', ['$scope', 'Users', 'SharedInfos', '$location', function ($scope, Users, SharedInfos, $location) {

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

    Users.validatePin($scope.formData, function(result) { // success
      $scope.badPin = false;
      $scope.acceptedPin = true;

      angular.merge($scope.formData, angular.fromJson((angular.toJson(result))));

    }, function(httpResponse) { // failure
      $scope.badPin = true;
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onChangePasswordClicked = function(){

    if(!$scope.formData.password || $scope.formData.password.length < 1)
      return;

    Users.changePassword($scope.formData, function(result) { // success
      $scope.changedPassword = true;
      $scope.errors = false;
      $scope.sentEmail = !result.mailError;
    }, function(httpResponse) { // failure
      $scope.changedPassword = false;
      $scope.errors = true;
      $scope.sentEmail = false;
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
