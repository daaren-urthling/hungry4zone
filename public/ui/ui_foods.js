//=============================================================================
// FoodsController - controller for ui_foods.html
//=============================================================================

app.controller('FoodsController', ['$scope', 'Foods', '$location', 'SharedInfos', function ($scope, Foods, $location, SharedInfos) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  $scope.alert = null;

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $location.url('/foodDetail/0');
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
}]);
