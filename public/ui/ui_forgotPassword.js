//=============================================================================
// ForgotPasswordController - controller for ui_forgotPassword.html
//=============================================================================

app.controller('ForgotPasswordController', ['$scope', 'Users', 'SharedInfo', function ($scope, Users, SharedInfo) {

  if (SharedInfo.get().email)  {
    $scope.formData = { email : SharedInfo.get().email };
  }

  //-----------------------------------------------------------------------------
  $scope.onForgotPasswordClicked = function(){

    if(!$scope.formData.email || $scope.formData.email.length < 1)
      return;

      Users.forgotPassword($scope.formData, function(result){
        if (result.success) {
          $scope.sentEmail = true;
        }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.$on("$destroy", function(){
    if ($scope.formData)
      SharedInfo.set($scope.formData);
  });

}]);
