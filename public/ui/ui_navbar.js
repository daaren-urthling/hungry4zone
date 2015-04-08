//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$rootScope',function ($scope, Users, $rootScope) {

  $scope.user = {};

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){
    //$scope.loginMessage = "";
    $scope.loginAlert = null;
    $rootScope.isAdmin = false;

    if(!$scope.user.username || $scope.user.username.length < 1)
      return;

    Users.login($scope.user, function(result){
      $rootScope.isAdmin = false;
      if (result.success)
        $rootScope.isAdmin = result.data.isAdmin;
      else
        $scope.loginAlert = { type : "danger", msg : "Login errata"};
        //$scope.loginMessage = "login failed";
    });

    //-----------------------------------------------------------------------------
    $scope.onCloseAlert = function(){
      $scope.loginAlert = null;
    };
  };


}]);
