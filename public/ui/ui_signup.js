//=============================================================================
// SignupController - controller for ui_signup.html
//=============================================================================

//=============================================================================
app.controller('SignupController', ['$scope', 'Users', '$location', 'SharedInfo', '$rootScope', function ($scope, Users, $location, SharedInfo, $rootScope) {

  var info = SharedInfo.get();
  $scope.signupOk = SharedInfo.get().signupResult && SharedInfo.get().signupResult.success;
  if ($scope.signupOk)  {
    $scope.name = SharedInfo.get().signupResult.data.name;
    $scope.email = SharedInfo.get().signupResult.data.email;
    $scope.emailError = SharedInfo.get().signupResult.emailError;
  }
  else
    $scope.message = SharedInfo.get().data;

  //-----------------------------------------------------------------------------
  $scope.onSignupClicked = function(obj){
    Users.signup($scope.formData, function(result){
                $rootScope.loggedUser = result.data;
                $scope.formData.signupResult = result;
                $location.url('/signupResult/');
            });
  };

  //-----------------------------------------------------------------------------
  $scope.$on("$destroy", function(){
    if ($scope.formData)
      SharedInfo.set($scope.formData);
  });

}]);

//=============================================================================
app.directive('match', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {

      scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
        ctrl.$setValidity('match', value[0] === value[1] );
      }, true);

    }
  };
}]);

//=============================================================================
app.directive('uniqueEmail', ['Users', function(Users) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.busy = false;
      scope.$watch(attrs.ngModel, function(value) {

        // hide old error messages
        ctrl.$setValidity('isTaken', true);

        if (!value) {
          // don't send undefined to the server during dirty check
          // empty username is caught by required directive
          return;
        }

        scope.busy = true;
        Users.checkEmail({email: value}, function(result){
          if (!result.success)
            ctrl.$setValidity('isTaken', false);
          // everything is fine -> do nothing
          scope.busy = false;
        });
      });
    }
  };
}]);
