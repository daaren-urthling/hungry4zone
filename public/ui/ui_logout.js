//=============================================================================
// LogoutController - controller for ui_logout.html
//=============================================================================

app.controller('LogoutController', ['$scope', '$rootScope', 'Users' ,function ($scope, $rootScope, Users) {

  if ($rootScope.loggedUser) {
    $scope.message = $rootScope.loggedUser.name;
  } else {
    $scope.message = "";
  }

  Users.loggedUser({logout : true}, function(result){
    if (result.success) {
      $rootScope.loggedUser = null;
    }
  });

}]);
