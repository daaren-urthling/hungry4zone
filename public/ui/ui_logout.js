//=============================================================================
// LogoutController - controller for ui_logout.html
//=============================================================================

app.controller('LogoutController', ['$scope', '$rootScope', 'Users' ,function ($scope, $rootScope, Users) {

  $scope.message = $rootScope.loggedUser.name;

  Users.loggedUser({logout : true}, function(result){
    if (result.success) {
      $rootScope.loggedUser = null;
    }
  });

}]);
