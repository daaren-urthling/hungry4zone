//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', function ($scope, SharedInfos, Meals, Foods) {

  $scope.meals = Meals.query({}, function() {
    Foods.query({}, function success(foods){
      $scope.meals.forEach(function(meal){
        Meals.reconnectFoods(meal, foods);
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
