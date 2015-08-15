//=============================================================================
// NavbarController - controller for index.ejs (navbar)
//=============================================================================

app.controller('NavbarController', ['$scope', 'Users', '$rootScope', '$location', function ($scope, Users, $rootScope, $location) {

  $rootScope.loggedUser = null;

  Users.loggedUser({}, function(result){
    if (result.id) {
      // result is a Resource object, remove the extra stuff to assign
      $rootScope.loggedUser = angular.fromJson(angular.toJson(result));
    }
  });

  //-----------------------------------------------------------------------------
  $scope.OnLogoutClicked = function(){
    Users.logout({}, function(){
      $rootScope.loggedUser = null;
      $location.url('/');
    });
  };

}]);
