//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', 'Users', '$rootScope', '$location', function ($scope, Users, $rootScope, $location) {

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){

    if(!$scope.loginData.email || $scope.loginData.email.length < 1 || !$scope.loginData.password || $scope.loginData.password.length < 1)
      return;

    Users.login($scope.loginData, function(result){
      $rootScope.loggedUser = null;
      $scope.loginError = null;
      if (result.success)
      {
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
  $scope.onResetPasswordClicked = function(){

    if(!$scope.resetData.email || $scope.resetData.email.length < 1)
      return;

      $scope.sentEmail = true;
  };

}]);
