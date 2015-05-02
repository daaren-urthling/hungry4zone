//=============================================================================
// SignupController - controller for ui_signup.html
//=============================================================================

//=============================================================================
app.service('SignupResult', function() {
  var result = {};

  var set = function(res) { result = res; };
  var get = function()    { return result;};

  return { set: set,  get: get  };
});

//=============================================================================
app.controller('SignupController', ['$scope', '$http', '$location', 'SignupResult', function ($scope, $http, $location, SignupResult) {

  // $scope.form = {};

  $scope.signupOk = SignupResult.get().success;
  $scope.message = SignupResult.get().data;

  //-----------------------------------------------------------------------------
  $scope.onSignupClicked = function(obj){
    $http.post('/signup', $scope.formData).success(function(result) {
                SignupResult.set(result);
                $location.url('/signupResult/');
            });
  };

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
