//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$rootScope',function ($scope, Users, $rootScope) {

  $rootScope.loggedUser = null;

  Users.loggedUser({}, function(result){
    if (result.success) {
      $rootScope.loggedUser = result.data;
    }
  });

}]);
