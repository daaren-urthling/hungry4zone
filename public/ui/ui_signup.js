//=============================================================================
// SignupController - controller for ui_signup.html
//=============================================================================

//=============================================================================
app.controller('SignupController', ['$scope', 'Users', '$location', 'SharedInfos', '$sessionStorage', function ($scope, Users, $location, SharedInfos, $sessionStorage) {

  if (SharedInfos.has("email"))  {
    $scope.formData = { email : SharedInfos.get("email") };
  }

  if (SharedInfos.has("forwardAddress")) {
    $scope.forwardAddress = SharedInfos.get("forwardAddress");
  }

  $scope.signupOk = false;
  $scope.signupDone = false;

  //-----------------------------------------------------------------------------
  $scope.onSignupClicked = function(obj){
    Users.signup($scope.formData, function(result){ // success
        $sessionStorage.loggedUser = result.loggedUser;
        $scope.name = result.loggedUser.name;
        $scope.email = result.loggedUser.email;
        $scope.emailError = result.mailError;

        $scope.signupOk = true;

        $scope.signupDone = true;
    }, function(httpResponse) { // failure
      delete $sessionStorage.loggedUser;
      $scope.message = GetErrorMessage(httpResponse);

      $scope.signupDone = true;
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onContinueClicked = function(){
    if ($scope.forwardAddress)
      $location.url($scope.forwardAddress);
    else
      $location.url("/");
  };

}]);

//=============================================================================
app.directive('fieldMatch', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {

      scope.$watch('[' + attrs.ngModel + ', ' + attrs.fieldMatch + ']', function(value){
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
          if (result.isTaken)
            ctrl.$setValidity('isTaken', false);
          // everything is fine -> do nothing
          scope.busy = false;
        });
      });
    }
  };
}]);
