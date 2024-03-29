//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'DailyPlan', 'SharedInfos', '$location', '$sessionStorage', '$route', '$modal', function ($scope, DailyPlan, SharedInfos, $location, $sessionStorage, $route, $modal) {

  $scope.dayNames = ["Sabato", "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"] ;
  $scope.mealKinds = [ 
    { name : "Colazione", short : false }, 
    { name : "1° Spuntino", short : true, tag: "Spuntino" }, 
    { name : "Pranzo", short : false }, 
    { name : "2° Spuntino", short : true, tag: "Spuntino" }, 
    { name : "Cena", short : false } 
  ];
  var today = new Date(); today.setHours(0,0,0,0);

  if ($sessionStorage.PlannerController && $sessionStorage.PlannerController.userId === $sessionStorage.loggedUser.id) {
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
      dailyPlan.userId = $sessionStorage.loggedUser.id;
      dailyPlan.date = addDays($scope.startDate, d);
      $scope.thisWeek.push(dailyPlan);
    }

    DailyPlan.search({userId: $sessionStorage.loggedUser.id, start: $scope.startDate, end: $scope.endDate}, function(result) { // success
      result.forEach(function(dailyPlan) {
        idx = diffDays(dailyPlan.date, $scope.startDate);
        $scope.thisWeek[idx] = dailyPlan;
        DailyPlan.reconnectMeals(dailyPlan);
      });
    }, function(httpResponse) { // failure
      $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  }

  $sessionStorage.PlannerController = { userId: $sessionStorage.loggedUser.id, thisWeek : $scope.thisWeek, startDate : $scope.startDate, endDate : $scope.endDate };

  if (SharedInfos.has("pickInfo"))  {
    pickInfo = SharedInfos.get("pickInfo");
    assignDailyMeal(pickInfo.day, pickInfo.kind, pickInfo.meal);
  }
  if (SharedInfos.has("dailyInfo"))  {
    dailyInfo = SharedInfos.get("dailyInfo");
    if (SharedInfos.has("mealInfo")) {
      mealInfo = SharedInfos.get("mealInfo");
      assignDailyMeal(dailyInfo.day, dailyInfo.kind, mealInfo.meal);
    }
  }

  //-----------------------------------------------------------------------------
  function assignDailyMeal(day, kind, meal) {
    dailyPlan = $scope.thisWeek[day];
    m = DailyPlan.indexOf(dailyPlan, kind);
    if (meal !== null) {
      if (m >= 0)
      dailyPlan.meals[m].meal = meal;
    else
      dailyPlan.meals.push({ kind : kind, meal : meal});
    } else {
      if (m >= 0) {
        dailyPlan.meals.splice(m,1);
      }      
    }

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
    var mealKind = $scope.mealKinds.find((k) => k.name === kind );
    SharedInfos.set("pickInfo", { day: $index, kind : kind, meal : DailyPlan.mealFor($scope.thisWeek[$index], kind), tag: mealKind.tag });
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
  $scope.onEditClicked = function(meal, kind, index){
    SharedInfos.set("mealInfo", { meal: jQuery.extend(true, {}, meal), action : "edit", noRemove: true });
    SharedInfos.set("dailyInfo", { day: index, kind : kind });
    SharedInfos.set("returnTo", "/planner");
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.onDuplicateClicked = function(meal, kind, index){
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Crea un nuovo pasto con ingredienti simili a "' + meal.name + '", poi aggiungilo al tuo ricettario ed al planner cliccando su "Salva"'});
    // clone the meal to not change the plan if canceled
    SharedInfos.set("mealInfo", { meal: jQuery.extend(true, {}, meal), action : "new" });
    SharedInfos.set("dailyInfo", { day: index, kind : kind });
    SharedInfos.set("returnTo", "/planner");
    $location.url('/calculator');
  };

  //-----------------------------------------------------------------------------
  $scope.onDailyDetailClicked = function($index, $event) {
    if ($event)
      $event.stopPropagation();

    var modalInstance = $modal.open({
      animation: false,
      templateUrl: 'ui_dailyPlan.html',
      controller: 'DailyPlanController',
      size : 'md',
      resolve: {
        dailyPlan: function () {
          return $scope.thisWeek[$index];
        },
        dayName: function ( ) {
          return $scope.dayNames[$index];
        },
        mealKinds: function ( ) {
          return $scope.mealKinds;
        }
      }
    });

    modalInstance.result.then(function (result) {
      switch (result.action) {
      }
    }, function (result) {
      switch (result.action) {
        case 'close': return;
        case 'duplicate':  {
          $scope.onDuplicateClicked(result.meal.meal, result.meal.kind, $index);
          return;
        }
        case 'edit': {
          $scope.onEditClicked(result.meal.meal, result.meal.kind, $index);
          return;
        }
      }      
    });
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
// DailyPlanController - controller for ui_dailyPlan.html
//=============================================================================

app.controller('DailyPlanController', ['$scope', 'Foods', '$modalInstance', 'dailyPlan', 'dayName', 'mealKinds', '$sessionStorage', function ($scope, Foods, $modalInstance, dailyPlan, dayName, mealKinds, $sessionStorage) {

  $scope.dailyPlan = dailyPlan;
  $scope.dayName = dayName;
  $scope.mealKinds = mealKinds;
  $scope.noImage = 'images/no-image-md.png';

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseClicked = function () {
    $modalInstance.dismiss('close');
  };

  //-----------------------------------------------------------------------------
  $scope.onDuplicateClicked = function (meal, $event) {
    if ($event)
    $event.stopPropagation();
    $modalInstance.dismiss({action: 'duplicate', meal: meal });
  };

  //-----------------------------------------------------------------------------
  $scope.onEditClicked = function (meal, $event) {
    if ($event)
    $event.stopPropagation();
    $modalInstance.dismiss({action: 'edit', meal: meal });
  };

  //-----------------------------------------------------------------------------
  $scope.isOwner = function(meal) {
    return  $sessionStorage.loggedUser &&
            (
              $sessionStorage.loggedUser.isAdmin ||
              meal.userId === $sessionStorage.loggedUser.id
            );
  };
  
}]);

//=============================================================================
// h4zMealFor - directive to keep the meal cells updated when the data model changes
//=============================================================================
app.directive('h4zMealFor',[ function() {
  return {
    restrict: 'A',
    link: function getMeal(scope, element, attrs) {
      var splits = attrs.h4zMealFor.split("=");
      scope.$watch(splits[1], function (val) {
        scope.$eval(attrs.h4zMealFor);
      });
    }
  };
}]);

//=============================================================================
// kindSort - filter for sorting dailyPlan by kind
//=============================================================================
app.filter('kindSort', function() {
    return function(input, mealKinds) {
        var result = [];
        for (var k in mealKinds) {
          m = DailyPlan.indexOf(input, mealKinds[k].name);
          if (m >= 0)
            result.push(input[m]);
        }
        return result;
    };
});
