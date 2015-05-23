//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', 'Users', '$rootScope', '$location', function ($scope, Users, $rootScope, $location) {

  $scope.badPin = false;
  $scope.acceptedPin = false;

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){

    if(!$scope.loginData.email || $scope.loginData.email.length < 1 || !$scope.loginData.password || $scope.loginData.password.length < 1)
      return;

    Users.login($scope.loginData, function(result){
      $rootScope.loggedUser = null;
      $scope.loginError = null;
      if (result.success) {
        $rootScope.loggedUser = result.data;
        $location.url("/");
      }
      else
        $scope.loginError = "L'indirizzo e-mail e la password non corrispondono.";
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.loginError = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onForgotPasswordClicked = function(){

    if(!$scope.forgotPasswordData.email || $scope.forgotPasswordData.email.length < 1)
      return;

      Users.forgotPassword($scope.forgotPasswordData, function(result){
        if (result.success) {
          $scope.sentEmail = true;
        }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onConfirmPinClicked = function(){
    if(!$scope.resetPasswordData.pin || $scope.resetPasswordData.pin.length < 1)
      return;

      Users.validatePin($scope.resetPasswordData, function(result){
        $scope.badPin = false;
        if (result.success) {
          $scope.acceptedPin = true;
          $scope.userName = result.data.name;
        }
        else {
          $scope.badPin = true;
        }
      });
  };

}]);
