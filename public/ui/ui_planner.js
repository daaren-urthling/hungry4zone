//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'DailyMeals', 'SharedInfos', '$location', '$sessionStorage', function ($scope, DailyMeals, SharedInfos, $location, $sessionStorage) {

  var today = new Date();
  // start on Saturday
  $scope.startDate  = addDays(today, -((today.getDay() + 1) % 7));
  $scope.endDate = addDays($scope.startDate, 6);
  $scope.dayNames = ["Sabato", "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"] ;
  $scope.mealKinds = [ { name : "Colazione", short : false }, { name : "Spuntino", short : true }, { name : "Pranzo", short : false }, { name : "Spuntino", short : true }, { name : "Cena", short : false } ];

  if ($sessionStorage.PlannerController) {
    $scope.thisWeek = $sessionStorage.PlannerController.thisWeek;
  } else {
    $scope.thisWeek = [];
    for (d = 0; d < 7; d++) {
      dailyMeals = new DailyMeals();
      dailyMeals.date = addDays($scope.startDate, d);
      $scope.thisWeek.push(dailyMeals);
    }
  }

  $sessionStorage.PlannerController = { thisWeek : $scope.thisWeek };

  if (SharedInfos.has("pickInfo"))  {
    pickInfo = SharedInfos.get("pickInfo");
    dailyMeal = DailyMeals.mealFor($scope.thisWeek[pickInfo.day], pickInfo.kind);
    if (dailyMeal)
      dailyMeal.meal = pickInfo.meal;
    else
      $scope.thisWeek[pickInfo.day].meals.push({ kind : pickInfo.kind, meal : pickInfo.meal});
  }

  //-----------------------------------------------------------------------------
  $scope.onMealClicked = function($index, kind) {
    dailyMeal = DailyMeals.mealFor($scope.thisWeek[$index], kind);
    SharedInfos.set("pickInfo", { day: $index, kind : kind, meal : dailyMeal ? dailyMeal.meal : null });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Scegli cosa vuoi ' + $scope.dayNames[$index] + ' per ' + kind + ', poi aggiungilo al planner cliccando su "Conferma"'});
    $location.url('/mealsGallery');
};

  //-----------------------------------------------------------------------------
  $scope.todayStyle = function($index, element) {
      if ($index == ((today.getDay() + 1) % 7))
        if (element === 'th')
          return "{'background-color':'lightblue'}";
        else
          return "{'background-color':'mintcream'}";
  };

  //-----------------------------------------------------------------------------
  $scope.dailyMealFor = function($index, kind) {
    return DailyMeals.mealFor($scope.thisWeek[$index], kind);
  };

}]);
