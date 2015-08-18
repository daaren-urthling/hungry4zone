//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', 'Users', '$location','SharedInfos', '$sessionStorage', function ($scope, Users, $location, SharedInfos, $sessionStorage) {

  if (SharedInfos.has("email"))  {
    $scope.formData = { email : SharedInfos.get("email") };
  }

  if (SharedInfos.has("forwardAddress")) {
    $scope.forwardAddress = SharedInfos.get("forwardAddress");
  }

  $scope.alert = null;
  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){

    if(!$scope.formData.email || $scope.formData.email.length < 1 || !$scope.formData.password || $scope.formData.password.length < 1)
      return;

    Users.login($scope.formData, function(result) {
      $scope.loginError = null;
      $sessionStorage.loggedUser = angular.fromJson(angular.toJson(result));
      if ($scope.forwardAddress) {
        $location.url($scope.forwardAddress);
      }
      else
        $location.url("/");
    }, function(httpResponse) { // failure
        delete $sessionStorage.loggedUser;
        $scope.loginError = GetErrorMessage(httpResponse);
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onForgotPasswordClicked = function(){
    if ($scope.formData && $scope.formData.email)
      SharedInfos.set("email", $scope.formData.email);

    if ($scope.forwardAddress)
      SharedInfos.set("forwardAddress", $scope.forwardAddress);

    $location.url("/forgotPassword");
  };

  //-----------------------------------------------------------------------------
  $scope.onSignupClicked = function(){
    if ($scope.formData && $scope.formData.email)
      SharedInfos.set("email", $scope.formData.email);

    if ($scope.forwardAddress)
      SharedInfos.set("forwardAddress", $scope.forwardAddress);

    $location.url("/signup");
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseLoginError = function(){
    $scope.loginError = null;
  };

}]);
