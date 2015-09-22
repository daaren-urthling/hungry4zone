//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'DailyPlan', 'SharedInfos', '$location', '$sessionStorage', function ($scope, DailyPlan, SharedInfos, $location, $sessionStorage) {

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
      dailyPlan = new DailyPlan();
      dailyPlan.date = addDays($scope.startDate, d);
      $scope.thisWeek.push(dailyPlan);
    }
  }

  $sessionStorage.PlannerController = { thisWeek : $scope.thisWeek };

  if (SharedInfos.has("pickInfo"))  {
    pickInfo = SharedInfos.get("pickInfo");
    dailyPlan = $scope.thisWeek[pickInfo.day];
    m = DailyPlan.indexOf(dailyPlan, pickInfo.kind);
    if (m >= 0)
      dailyPlan.meals[m].meal = pickInfo.meal;
    else
      dailyPlan.meals.push({ kind : pickInfo.kind, meal : pickInfo.meal});

    store(dailyPlan);
  }

  //-----------------------------------------------------------------------------
  function store(dailyPlan) {
    if (!dailyPlan._id) {
      DailyPlan.save(dailyPlan, function success(result) {
        dailyPlan._id = result._id;
      }, function failure(httpResponse) {
          $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
      });
    } else {
      DailyPlan.update({id: dailyPlan._id}, dailyPlan, function success(result) {
      }, function failure(httpResponse) {
          $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
      });
    }
  }

  //-----------------------------------------------------------------------------
  $scope.onNotesChanged = function($index) {
    store($scope.thisWeek[$index]);
  };

  //-----------------------------------------------------------------------------
  $scope.onMealClicked = function($index, kind) {
    SharedInfos.set("pickInfo", { day: $index, kind : kind, meal : DailyPlan.mealFor($scope.thisWeek[$index], kind) });
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
  $scope.mealFor = function($index, kind) {
    return DailyPlan.mealFor($scope.thisWeek[$index], kind);
  };

}]);
