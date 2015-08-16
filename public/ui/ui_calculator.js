//=============================================================================
// CalculatorController - controller for ui_calculator.html
//=============================================================================

app.controller('CalculatorController', ['$scope', '$rootScope', 'Meals', 'Foods', 'FoodTypes', 'MealItems', '$location', 'SharedInfos', function ($scope, $rootScope, Meals, Foods, FoodTypes, MealItems, $location, SharedInfos) {
  $scope.meal = new Meals();
  $scope.meal.adjustTail();

  $scope.hint = "";

  Meals.cacheRetrieve(function(result) {
    if (result.mealItems) {
      $scope.meal.mealItems = [];
      result.mealItems.forEach(function(mealItem, idx) {
          $scope.meal.mealItems.push(new MealItems());
          angular.merge($scope.meal.mealItems[idx], mealItem);
      });
      recalculate();
      $scope.meal.adjustTail();
    }

    // Query the foods in any case to fill up the list.
    // On success reconnect the meal items "food" objects with those of the array,
    // missing that the dropdown selected items will remain empty
    $scope.foods = Foods.query({}, function success(foods){
      $scope.meal.reconnectFoods(foods);
    });
  });


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

    if ($scope.meal.mealRatio < 0.6)
      $scope.hint = "Troppi carboidrati";
    else if ($scope.meal.mealRatio > 1.0)
      $scope.hint = "Troppe proteine";
    else
      $scope.hint = "";

    $scope.balanceGauge.refresh($scope.meal.mealRatio);
  }

  //-----------------------------------------------------------------------------
  $scope.onFoodSelected = function($item, $index, mealItem)  {
    FoodTypes.get({id: mealItem.food.type }, function(result) {
      // result is a Resource object, remove the extra stuff to assign
      mealItem.foodType = angular.fromJson(angular.toJson(result));
      recalculate(mealItem);
      Meals.cacheItem({item: mealItem, idx: $index});
    });
    $scope.meal.adjustTail();
  };

  //-----------------------------------------------------------------------------
  $scope.onQtyChanged = function(mealItem, $index){
    if (!mealItem)
      return;

    mealItem.adjustLocale();

    recalculate(mealItem);
    Meals.cacheItem({item: mealItem, idx: $index});

    // need to call manually $apply as called via onchange (not ng-change)
    $scope.$apply();
  };

  //-----------------------------------------------------------------------------
  $scope.onQtyPlusMinusClicked = function(mealItem, sign, $index){
    if (!mealItem)
      return;

    if (sign == '+')
      factor = 1;
    else
      factor = -1;

    if (mealItem.qty < 100)
      augment = 5;
    else
      augment = 10;

    mealItem.qty = parseInt(mealItem.qty) + augment * factor;
    if (mealItem.qty < 0.0)
      mealItem.qty =0.0;

    recalculate(mealItem);
    Meals.cacheItem({item: mealItem, idx: $index});

  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveLineClicked = function($index){
    $scope.meal.mealItems.splice($index,1);
    recalculate();
    Meals.removeCachedItem({idx: $index});
    $scope.meal.adjustTail();
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveAllClicked = function(){
    $scope.meal = new Meals();
    $scope.meal.adjustTail();
    recalculate();
    Meals.removeAllCache();
  };

  //-----------------------------------------------------------------------------
  $scope.onMealSaveClicked = function(){
    $scope.meal.removeTail();
    SharedInfos.set("meal", $scope.meal);
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.contains = function(name, viewValue) {
    words = name.split(" ");
    for (w = 0; w < words.length; w++)
    {
      if (words[w].substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase())
        return true;
    }
    return false;
  };

  $scope.balanceGauge = new JustGage({
    id: "balanceGauge",
    value: 0,
    min: 0,
    max: 1.5,
    title: "Rapporto\n proteine / carboidrati",
    label: "minimo 0.6 - ottimo 0.75 - massimo 1.0",
    levelColors: [
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",  // Red - < 0,59
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      //------------------------------------
      "#FFA500",  // Orange - 0,59 : 0,62
      //------------------------------------
      "#FFFF00",  // Yellow - 0,63 : 0,67
      //------------------------------------
      "#00FF00",
      "#00FF00",  //  Green - 0,68 : 0,82
      "#00FF00",
      //------------------------------------
      "#FFFF00",
      "#FFFF00",  // Yellow - 0,83 : 0,96
      "#FFFF00",
      //------------------------------------
      "#FFA500",  // Orange - 0,97 : 1,01
      //------------------------------------
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",  // Red - > 1,01
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000",
      "#FF0000"
    ],
    levelColorsGradient: false,
    gaugeWidthScale:1.5,
    showMinMax:false,
    labelFontColor:"#000000"
  });

}]);
