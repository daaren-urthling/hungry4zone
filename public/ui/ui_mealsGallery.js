//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', '$location', function ($scope, SharedInfos, Meals, Foods, $location) {

  Foods.query({}, function success(foods){
    $scope.meals = Meals.query({}, function() {
      for (mdx = 0; mdx < $scope.meals.length; mdx++ ){
        meal = new Meals();
        angular.merge(meal, $scope.meals[mdx]);
        $scope.meals[mdx] = meal;
        Meals.rebindObjects($scope.meals[mdx], foods);
        //Meals.reconnectFoods($scope.meals[idx], foods);
      }
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
