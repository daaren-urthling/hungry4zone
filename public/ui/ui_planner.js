//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'DailyMeals', function ($scope, DailyMeals) {

  var today = new Date();
  // start on Saturday
  $scope.startDate  = addDays(today, -((today.getDay() + 1) % 7));
  $scope.endDate = addDays($scope.startDate, 6);
  $scope.dayNames = ["Sabato", "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"] ;
  $scope.mealKinds = [ { name : "Colazione", short : false }, { name : "Spuntino", short : true }, { name : "Pranzo", short : false }, { name : "Spuntino", short : true }, { name : "Cena", short : false } ];

  $scope.thisWeek = [];
  for (d = 0; d < 7; d++) {
    dailyMeals = new DailyMeals();
    dailyMeals.date = addDays($scope.startDate, d);
    $scope.thisWeek.push(dailyMeals);
  }

  //-----------------------------------------------------------------------------
  $scope.onMealClicked = function($index, kIndex) {

  };

  //-----------------------------------------------------------------------------
  $scope.todayStyle = function($index, element) {
      if ($index == ((today.getDay() + 1) % 7))
        if (element === 'th')
          return "{'background-color':'lightblue'}";
        else
          return "{'background-color':'mintcream'}";
  };
}]);
