//=============================================================================
// CalculatorController - controller for ui_calculator.html
//=============================================================================

app.controller('CalculatorController', ['$scope', '$rootScope', 'Meals', 'Foods', function ($scope, $rootScope, Meals, Foods) {
  $scope.meal = new Meals();
  $scope.meal.totCalories = 100;

  $scope.foods = Foods.query();

  //-----------------------------------------------------------------------------
  $scope.onFoodSelected = function($item, $index, mealItem)  {
    console.log($item, $index, mealItem);
    if ($index == $scope.meal.mealItems.length - 1)
      $scope.meal.mealItems.push({});
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveLineClicked = function($index){
    console.log('remove ',$index);
    $scope.meal.mealItems.splice($index,1);
    if ($scope.meal.mealItems.length < $scope.meal.minLength)
      $scope.meal.mealItems.push({});
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveAllClicked = function(){
    $scope.meal = new Meals();
  };
}]);
