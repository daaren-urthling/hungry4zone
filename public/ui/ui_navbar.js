//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$location', '$sessionStorage', function ($scope, Users, $location, $sessionStorage) {

  $scope.$storage = $sessionStorage;

  //-----------------------------------------------------------------------------
  $scope.OnLogoutClicked = function(){
    Users.logout({}, function(){
      delete $sessionStorage.loggedUser;
      $location.url('/');
    });
  };

}]);
