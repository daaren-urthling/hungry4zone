//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', 'Users', '$rootScope', '$location','SharedInfo', function ($scope, Users, $rootScope, $location, SharedInfo) {

  $scope.badPin = false;
  $scope.acceptedPin = false;

  if (SharedInfo.get().email)  {
    $scope.forgotPasswordData = { email : SharedInfo.get().email };
    $scope.loginData = { email : SharedInfo.get().email };
  }

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
          $scope.resetPasswordData.name = result.data.name;
          $scope.resetPasswordData.id = result.id;
          $scope.resetPasswordData.email = result.data.email;
        }
        else {
          $scope.badPin = true;
        }
      });
  };

  //-----------------------------------------------------------------------------
  $scope.onChangePasswordClicked = function(){

    if(!$scope.resetPasswordData.password || $scope.resetPasswordData.password.length < 1)
      return;

      Users.changePassword($scope.resetPasswordData, function(result){
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
    if ($scope.loginData)
      SharedInfo.set($scope.loginData);
    if ($scope.resetPasswordData)
      SharedInfo.set($scope.resetPasswordData);
  });

}]);
