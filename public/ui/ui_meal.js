//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', '$location', '$rootScope', 'Meals', 'MealItems', function ($scope, SharedInfos, $location, $rootScope, Meals, MealItems) {

  $scope.meal = new Meals();
  Meals.cacheRetrieve(function(result) {
    if (result.mealItems) {
      $scope.meal.mealItems = [];
      result.mealItems.forEach(function(mealItem, idx) {
          $scope.meal.mealItems.push(new MealItems());
          angular.merge($scope.meal.mealItems[idx], mealItem);
      });
    }
  });

  $scope.isNew = true;

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    if(!$scope.meal.name || $scope.meal.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome del pasto'};
      return;
    }

    $scope.meal.$save(function(result) { // success
        SharedInfos.set("alert", { "type" : "success", "msg" : "inserito un nuovo pasto: " + $scope.meal.name});
        $location.url('/mealsGallery');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){

    $scope.meal.$update({id: $scope.meal._id}, $scope.meal, function(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Pasto modificato: " + $scope.meal.name});
      $location.url('/mealsGallery/');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    $scope.meal.$remove({id: $scope.meal._id}, function(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Pasto eliminato: " + $scope.meal.name});
      $location.url('/mealsGallery/');
    });
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
