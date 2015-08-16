//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$rootScope', '$location', function ($scope, Users, $rootScope, $location) {

  //-----------------------------------------------------------------------------
  $scope.OnLogoutClicked = function(){
    Users.logout({}, function(){
      $rootScope.loggedUser = null;
      $location.url('/');
    });
  };

}]);
