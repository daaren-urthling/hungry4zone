//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', function ($scope, SharedInfos) {

  if (SharedInfos.has("meal"))  {
    $scope.meal = SharedInfos.get("meal");
  }

  $scope.isNew = true;

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    if(!$scope.meal.name || $scope.meal.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome del pasto'};
      return;
    }

    var newMeal = $scope.meal.name;

    $scope.meal.$save(function(result){
      if (!result.success && result.id)
        $scope.alert = { type : "danger", msg : 'Pasto già presente'};
      else
      {
        // SharedInfos.set("alert", { "type" : "success", "msg" : "inserito un nuovo pasto: " + newMeal});
        $location.url('/');
      }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    var changedFood = $scope.food.name;

    Foods.update({id: $scope.food._id}, $scope.food, function(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Alimento modificato: " + changedFood});
      $location.url('/foods/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){

    var removedFood = $scope.food.name;

    Foods.remove({id: $scope.food._id}, function(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Alimento eliminato: " + removedFood});
      $location.url('/foods/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onMealNameChanged = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

}]);
