//=============================================================================
// ForgotPasswordController - controller for ui_forgotPassword.html
//=============================================================================

app.controller('ForgotPasswordController', ['$scope', 'Users', 'SharedInfos', function ($scope, Users, SharedInfos) {

  if (SharedInfos.has("email"))  {
    $scope.formData = { email : SharedInfos.get("email") };
  }

  if (SharedInfos.has("forwardAddress")) {
    $scope.forwardAddress = SharedInfos.get("forwardAddress");
  }

  //-----------------------------------------------------------------------------
  $scope.onForgotPasswordClicked = function(){

    if(!$scope.formData.email || $scope.formData.email.length < 1)
      return;

      Users.forgotPassword($scope.formData, function(){ // success
        $scope.sentEmail = true;
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.$on("$destroy", function(){
    if ($scope.formData && $scope.formData.email)
      SharedInfos.set("email", $scope.formData.email);
    if ($scope.forwardAddress)
      SharedInfos.set("forwardAddress", $scope.forwardAddress);
  });

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

}]);
