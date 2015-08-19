//=============================================================================
// FoodsController - controller for ui_foods.html
//=============================================================================

app.controller('FoodsController', ['$scope', 'Foods', '$location', 'SharedInfos', '$sessionStorage', function ($scope, Foods, $location, SharedInfos, $sessionStorage) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  $scope.alert = null;
  $scope.$storage = $sessionStorage;

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $location.url('/foodDetail/0');
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
}]);
