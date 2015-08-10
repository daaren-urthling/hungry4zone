//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', function ($scope, SharedInfos) {

  if (SharedInfos.has("meal"))  {
    $scope.meal = SharedInfos.get("meal");
    for (i = $scope.meal.mealItems.length - 1; i > 0; i--)
      if ($scope.meal.mealItems[i].food.name === "")
        $scope.meal.mealItems.splice(i);
  }

}]);
