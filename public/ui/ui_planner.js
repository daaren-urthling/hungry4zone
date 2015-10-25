//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'DailyPlan', 'SharedInfos', '$location', '$sessionStorage', '$route', function ($scope, DailyPlan, SharedInfos, $location, $sessionStorage, $route) {

  $scope.dayNames = ["Sabato", "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"] ;
  $scope.mealKinds = [ { name : "Colazione", short : false }, { name : "Spuntino", short : true }, { name : "Pranzo", short : false }, { name : "Spuntino", short : true }, { name : "Cena", short : false } ];
  var today = new Date(); today.setHours(0,0,0,0);

  if ($sessionStorage.PlannerController) {
    $scope.thisWeek = $sessionStorage.PlannerController.thisWeek;
    $scope.startDate = $sessionStorage.PlannerController.startDate;
    $scope.endDate = $sessionStorage.PlannerController.endDate;
  } else {
    if (SharedInfos.has("startDate"))  {
      $scope.startDate = SharedInfos.get("startDate");
    } else {
      // start on Saturday
      $scope.startDate  = addDays(today, -((today.getDay() + 1) % 7));
    }
    $scope.endDate = addDays($scope.startDate, 6);

    $scope.thisWeek = [];
    for (d = 0; d < 7; d++) {
      dailyPlan = new DailyPlan();
      dailyPlan.date = addDays($scope.startDate, d);
      $scope.thisWeek.push(dailyPlan);
    }

    DailyPlan.search({start: $scope.startDate, end: $scope.endDate}, function(result) { // success
      result.forEach(function(dailyPlan) {
        idx = diffDays(dailyPlan.date, $scope.startDate);
        $scope.thisWeek[idx] = dailyPlan;
        DailyPlan.reconnectMeals(dailyPlan);
      });
    }, function(httpResponse) { // failure
      $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  }


  $sessionStorage.PlannerController = { thisWeek : $scope.thisWeek, startDate : $scope.startDate, endDate : $scope.endDate };

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
  $scope.onChangeMealClicked = function($index, kind, $event) {
    if ($event)
      $event.stopPropagation();
    SharedInfos.set("pickInfo", { day: $index, kind : kind, meal : DailyPlan.mealFor($scope.thisWeek[$index], kind) });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Scegli cosa vuoi ' + $scope.dayNames[$index] + ' per ' + kind + ', poi aggiungilo al planner cliccando su "Conferma"'});
    $location.url('/mealsGallery');
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveMealClicked = function($index, kind, $event) {
    if ($event)
      $event.stopPropagation();
    dailyPlan = $scope.thisWeek[$index];
    m = DailyPlan.indexOf(dailyPlan, kind);
    if (m >= 0) {
      dailyPlan.meals.splice(m,1);
      store(dailyPlan);
    }
  };

  //-----------------------------------------------------------------------------
  $scope.onDailyDetailClicked = function($index, $event) {
    if ($event)
      $event.stopPropagation();
  };

  //-----------------------------------------------------------------------------
  $scope.backgroundColor = function($index, element) {
    if (addDays($scope.startDate, $index).valueOf() != today.valueOf())
      return ;

    if (element === 'th')
      return "lightblue";
    else
      return "mintcream";
  };

  //-----------------------------------------------------------------------------
  $scope.mealFor = function($index, kind) {
    return DailyPlan.mealFor($scope.thisWeek[$index], kind);
  };

  //-----------------------------------------------------------------------------
  $scope.onChangeWeekClicked = function(direction) {
      $scope.startDate  = addDays($scope.startDate, direction * 7);
      SharedInfos.set("startDate", $scope.startDate);
      $sessionStorage.PlannerController = null;
      $route.reload();
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

}]);

//=============================================================================
// h4zMealFor - drective to keep the meal cells updated when the data model changes
//=============================================================================
app.directive('h4zMealFor',[ function() {
  return {
    restrict: 'A',
    link: function getMeal(scope, element, attrs) {
      var splits = attrs.h4zMealFor.split("=");
      scope.$watch(splits[1], function (val) {
        scope.$eval(attrs.h4zMealFor);
        // console.log(scope.day, scope.$parent.kind.name, scope.meal ? scope.meal.name : "manca");
      });
    }
  };
}]);
