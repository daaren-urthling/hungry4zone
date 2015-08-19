//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', '$location', 'Meals', '$sessionStorage', function ($scope, SharedInfos, $location, Meals, $sessionStorage) {

  if (SharedInfos.has("mealInfo"))  {
    mealInfo = SharedInfos.get("mealInfo");
    $scope.meal = mealInfo.meal;
    $scope.isNew = (mealInfo.action === "new");
    if ($scope.isNew && $sessionStorage.loggedUser)
      $scope.meal.userId = $sessionStorage.loggedUser.id;
  } else if ($sessionStorage.MealController) {
    $scope.meal = $sessionStorage.MealController.meal;
    $scope.isNew = $sessionStorage.MealController.isNew;
  } else {
    $scope.isNew = true;
    $scope.meal = new Meals();
  }

  $sessionStorage.MealController = { meal : $scope.meal, isNew : $scope.isNew };

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    if(!$scope.meal.name || $scope.meal.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome del pasto'};
      return;
    }

    Meals.save($scope.meal, function success(result) {
        SharedInfos.set("alert", { "type" : "success", "msg" : "inserito un nuovo pasto: " + $scope.meal.name});
        delete $sessionStorage.MealController;
        $location.url('/mealsGallery');
    }, function failure(httpResponse) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    if(!$scope.meal.name || $scope.meal.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome del pasto'};
      return;
    }

    Meals.update({id: $scope.meal._id}, $scope.meal, function success(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Pasto modificato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      $location.url('/mealsGallery/');
    }, function failure(httpResponse) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    Meals.remove({id: $scope.meal._id}, function success(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Pasto eliminato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      $location.url('/mealsGallery');
    }, function failure(httpResponse) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onCancelClicked = function(){
    // after cancel the cache is no longer needed
    delete $sessionStorage.MealController;
    if ($scope.isNew) {
      SharedInfos.set("mealInfo", { meal: $scope.meal, action : "new" });
      $location.url('/calculator');
    }
    else
      $location.url('/mealsGallery');
  };

  //-----------------------------------------------------------------------------
  $scope.onChangeIngredientsClicked = function(){
    SharedInfos.set("mealInfo", { meal: $scope.meal, action : "edit" });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Modifica gli alimenti di "' + $scope.meal.name + '", poi aggiorna il tuo ricettario cliccando su "Continua"'});
    $location.url('/calculator');
  };

  //-----------------------------------------------------------------------------
  $scope.onMealNameChanged = function(){
    $scope.alert = null;
    if (!$scope.isNew) return;

    Meals.search({name: $scope.meal.name }, function(result) { // success
        if (result._id)
          $scope.alert = { type : "danger", msg : 'Pasto già presente'};
      }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
      });
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

}]);
