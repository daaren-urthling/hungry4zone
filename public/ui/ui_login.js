//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', 'Users', '$rootScope', '$location','SharedInfo', function ($scope, Users, $rootScope, $location, SharedInfo) {

  if (SharedInfo.get().email)  {
    $scope.formData = { email : SharedInfo.get().email };
  }
  // } else if (SharedInfo.get().forwardAddress) {
  //   $scope.forwardAddress = SharedInfo.get().forwardAddress;
  // }

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){

    if(!$scope.formData.email || $scope.formData.email.length < 1 || !$scope.formData.password || $scope.formData.password.length < 1)
      return;

    Users.login($scope.formData, function(result){
      $rootScope.loggedUser = null;
      $scope.loginError = null;
      if (result.success) {
        $rootScope.loggedUser = result.data;
        if ($rootScope.forwardAddress) {
          $location.url($rootScope.forwardAddress);
          $rootScope.forwardAddress = null;
        }
        else
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
  $scope.$on("$destroy", function(){
    if ($scope.formData)
      SharedInfo.set($scope.formData);
  });

}]);
