//=============================================================================
// CalculatorController - controller for ui_calculator.html
//=============================================================================

app.controller('CalculatorController', ['$scope', '$rootScope', 'Meals', 'Foods', 'FoodTypes', function ($scope, $rootScope, Meals, Foods, FoodTypes) {
  $scope.meal = new Meals();

  $scope.foods = Foods.query();

  //-----------------------------------------------------------------------------
  function recalculate(mealItem){
    if (mealItem) {
      mealItem.totProteins      = 0.0;
      mealItem.totFats          = 0.0;
      mealItem.totCarbohydrates = 0.0;

      if (mealItem.food && mealItem.foodType) {
        mealItem.totProteins      = mealItem.qty * mealItem.food.proteins       * (mealItem.foodType.proteineAbsorption / 100.00) / 100.00;
        mealItem.totFats          = mealItem.qty * mealItem.food.fats           / 100.00;
        mealItem.totCarbohydrates = mealItem.qty * mealItem.food.carbohydrates  / 100.00;
      }
    }

    $scope.meal.totProteins      = 0.0;
    $scope.meal.totFats          = 0.0;
    $scope.meal.totCarbohydrates = 0.0;
    $scope.meal.mealItems.forEach(function(mealItem){
      $scope.meal.totProteins      += (typeof mealItem.totProteins      === "undefined") ? 0 : mealItem.totProteins;
      $scope.meal.totFats          += (typeof mealItem.totFats          === "undefined") ? 0 : mealItem.totFats;
      $scope.meal.totCarbohydrates += (typeof mealItem.totCarbohydrates === "undefined") ? 0 : mealItem.totCarbohydrates;
    });

    $scope.meal.blockProteins      = $scope.meal.totProteins * 0.14;
    $scope.meal.blockFats          = $scope.meal.totFats * 0.32;
    $scope.meal.blockCarbohydrates = $scope.meal.totCarbohydrates * 0.11;

    $scope.meal.totCalories = Math.ceil($scope.meal.totProteins * 4 + $scope.meal.totFats * 9 + $scope.meal.totCarbohydrates * 4);
    $scope.meal.mealRatio = $scope.meal.totCarbohydrates !== 0.0 ?
                              Math.floor(($scope.meal.totProteins / $scope.meal.totCarbohydrates) * 100.00) / 100.00 :
                              100.00;
  }

  //-----------------------------------------------------------------------------
  $scope.onFoodSelected = function($item, $index, mealItem)  {
    FoodTypes.get({id: mealItem.food.type }, function(result) {
      if (result.success)
      {
        mealItem.foodType = result.data;
        recalculate(mealItem);
      }
    });
    if ($index == $scope.meal.mealItems.length - 1)
      $scope.meal.mealItems.push({});
  };

  //-----------------------------------------------------------------------------
  $scope.onQtyChanged = function(mealItem){
    if (!mealItem)
      return;

    recalculate(mealItem);

    // need to call manually $apply as called via onchange (not ng-change)
    $scope.$apply();
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveLineClicked = function($index){
    $scope.meal.mealItems.splice($index,1);
    recalculate();
    if ($scope.meal.mealItems.length < $scope.meal.minLength)
      $scope.meal.mealItems.push({});
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveAllClicked = function(){
    $scope.meal = new Meals();
    recalculate();
  };
}]);
