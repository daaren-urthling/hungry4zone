//=============================================================================
// SignupController - controller for ui_signup.html
//=============================================================================

//=============================================================================
app.controller('SignupController', ['$scope', '$http', '$location', 'SharedInfo', '$rootScope', function ($scope, $http, $location, SharedInfo, $rootScope) {

  $scope.signupOk = SharedInfo.get().success;
  if ($scope.signupOk)  {
    $scope.name = SharedInfo.get().data.name;
    $scope.email = SharedInfo.get().data.email;
  }
  else
    $scope.message = SharedInfo.get().data;

  //-----------------------------------------------------------------------------
  $scope.onSignupClicked = function(obj){
    $http.post('/signup', $scope.formData).success(function(result) {
                $rootScope.loggedUser = result.data;
                SharedInfo.set(result);
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
app.directive('uniqueEmail', ['$http', function($http) {
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
        $http.post('/signup/checkEmail', {email: value}).success(function(result) {
          if (!result.success)
            ctrl.$setValidity('isTaken', false);
          // everything is fine -> do nothing
          scope.busy = false;
        });
      });
    }
  };
}]);
