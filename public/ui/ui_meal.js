//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', '$location', '$rootScope', 'Meals', '$sessionStorage', function ($scope, SharedInfos, $location, $rootScope, Meals, $sessionStorage) {

  if (SharedInfos.has("meal"))  {
    $scope.meal = SharedInfos.get("meal");
    $scope.meal.userId = $rootScope.loggedUser.id;
    $scope.isNew = !$scope.meal._id || $scope.meal._id === "";
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

    $scope.meal.$save(function(result) { // success
        SharedInfos.set("alert", { "type" : "success", "msg" : "inserito un nuovo pasto: " + $scope.meal.name});
        delete $sessionStorage.MealController;
        $location.url('/mealsGallery');
    }, function(httpResponse) { // failure
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

    $scope.meal.$update({id: $scope.meal._id}, $scope.meal, function(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Pasto modificato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      $location.url('/mealsGallery/');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    $scope.meal.$remove({id: $scope.meal._id}, function(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Pasto eliminato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      $location.url('/mealsGallery/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onCancelClicked = function(){
    SharedInfos.set("meal", $scope.meal);
    // passing the meal to the calculator the cache is no longer needed
    delete $sessionStorage.MealController;
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
