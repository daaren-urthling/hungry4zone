//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', function ($scope, SharedInfos, Meals, Foods) {

  $scope.meals = Meals.query({}, function() {
    Foods.query({}, function success(foods){
      $scope.meals.forEach(function(meal){
        meal.mealItems.forEach(function(mealItem, idx){
          food = Foods.findById(foods, mealItem.food);
          if (food)
            meal.mealItems[idx].food = food;
        });
      });
    });
  });

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
}]);
