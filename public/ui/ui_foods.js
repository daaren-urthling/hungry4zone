//=============================================================================
// FoodsController - controller for ui_foods.html
//=============================================================================

app.controller('FoodsController', ['$scope', 'Foods', '$location', function ($scope, Foods, $location) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $location.url('/0');
  };
}]);
