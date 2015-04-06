//=============================================================================
// FoodsController - controller for ui_foods.html
//=============================================================================

app.controller('FoodsController', ['$scope', 'Foods', '$location', '$routeParams', function ($scope, Foods, $location, $routeParams) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  $scope.alert = null;
  if ($routeParams.alert)
    $scope.alert = angular.fromJson($routeParams.alert);

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $location.url('/foodDetail/0');
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
}]);
