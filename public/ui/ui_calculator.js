//=============================================================================
// CalculatorController - controller for ui_calculator.html
//=============================================================================

app.controller('CalculatorController', ['$scope', 'Meals', 'Foods', 'FoodTypes', '$location', 'SharedInfos', 'MealItems', '$sessionStorage', function ($scope, Meals, Foods, FoodTypes, $location, SharedInfos, MealItems, $sessionStorage) {
  $scope.hint = "";

  if (SharedInfos.has("mealInfo"))  {
    mealInfo = SharedInfos.get("mealInfo");
    $scope.meal = mealInfo.meal;
    $scope.isNew = (mealInfo.action === "new");
    $scope.foods = Foods.query({}, function success() {
      Meals.reconnectFoods($scope.meal);
      recalculate();
      Meals.adjustTail($scope.meal);
    });
  } else if ($sessionStorage.CalculatorController) {
    $scope.meal = $sessionStorage.CalculatorController.meal;
    $scope.isNew = $sessionStorage.CalculatorController.isNew;
    $scope.foods = Foods.query({}, function success() {
      Meals.reconnectFoods($scope.meal);
      recalculate();
      Meals.adjustTail($scope.meal);
    });
  } else {
    $scope.meal = new Meals();
    $scope.isNew = true;
    Meals.adjustTail($scope.meal);
    $scope.foods = Foods.query();
  }

  $sessionStorage.CalculatorController = { meal : $scope.meal, isNew : $scope.isNew };

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  function recalculate(mealItem){
    if (mealItem) {
      mealItem.totProteins      = 0.0;
      mealItem.totFats          = 0.0;
      mealItem.totCarbohydrates = 0.0;

      if (mealItem.food && mealItem.food.type) {
        foodType = FoodTypes.find(mealItem.food.type);
        mealItem.totProteins      = mealItem.qty * mealItem.food.proteins       * (foodType.proteineAbsorption / 100.00) / 100.00;
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

    if ($scope.balanceGauge)
      $scope.balanceGauge.refresh($scope.meal.mealRatio);
  }

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.onFoodSelected = function($item, $index, mealItem)  {
    recalculate(mealItem);
    Meals.adjustTail($scope.meal);
  };

  //-----------------------------------------------------------------------------
  $scope.onQtyChanged = function(mealItem, $index){
    if (!mealItem)
      return;

    MealItems.adjustLocale(mealItem);

    recalculate(mealItem);

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
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveLineClicked = function($index){
    $scope.meal.mealItems.splice($index,1);
    recalculate();
    Meals.adjustTail($scope.meal);
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveAllClicked = function(){
    $scope.meal = new Meals();
    Meals.adjustTail($scope.meal);
    recalculate();
  };

  //-----------------------------------------------------------------------------
  $scope.onMealSaveClicked = function(){
    Meals.removeTail($scope.meal);
    SharedInfos.set("mealInfo", { meal: $scope.meal, action : ($scope.isNew ? "new" : "edit") });
    // passing the meal to the meal editor the cache is no longer needed
    delete $sessionStorage.CalculatorController;
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
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
