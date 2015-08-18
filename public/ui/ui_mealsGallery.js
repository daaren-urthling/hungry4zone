//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', '$location', function ($scope, SharedInfos, Meals, Foods, $location) {

  $scope.meals = Meals.query({}, function() {
    $scope.meals.forEach (function(meal, idx) {
      Meals.reconnectFoods($scope.meals[idx]);
    });
  });

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onEditClicked = function(meal){
    SharedInfos.set("meal", meal);
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.onDuplicateClicked = function(meal){
    SharedInfos.set("meal", meal);
    $location.url('/calculator');
  };
}]);
