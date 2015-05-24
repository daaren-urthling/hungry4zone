//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$rootScope', '$location', function ($scope, Users, $rootScope, $location) {

  $rootScope.loggedUser = null;

  Users.loggedUser({}, function(result){
    if (result.success) {
      $rootScope.loggedUser = result.data;
    }
  });

  //-----------------------------------------------------------------------------
  $scope.OnLogoutClicked = function(){
    Users.logout({}, function(result){
      if (result.success) {
        $rootScope.loggedUser = null;
        $location.url('/');
      }
    });
  };

}]);
