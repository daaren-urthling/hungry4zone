//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfo', function ($scope, SharedInfo) {

  if (SharedInfo.get().mealItems)  {
    $scope.meal = SharedInfo.get();
    for (i = $scope.meal.mealItems.length - 1; i > 0; i--)
      if ($scope.meal.mealItems[i].food.name === "")
        $scope.meal.mealItems.splice(i);
  }

}]);
