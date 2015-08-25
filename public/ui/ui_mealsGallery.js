//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', '$location', 'Picasa', '$modal', function ($scope, SharedInfos, Meals, Foods, $location, Picasa, $modal) {

  $scope.noImage = 'images/no-image.png';

  $scope.meals = Meals.query({}, function() {
    $scope.meals.forEach (function(meal, idx) {
      Meals.reconnectFoods($scope.meals[idx]);
      if ($scope.meals[idx].imageCoord) {
        Picasa.getImageURL($scope.meals[idx].imageCoord, 128).then(function(imageURL) {
          $scope.meals[idx].imageURL = imageURL;
        }) ;
      }
    });
  });

  if (SharedInfos.has("alert"))  {
    $scope.alert = SharedInfos.get("alert");
  }

  $scope.currentPage = 1;
  $scope.itemsPerPage = 6;
  $scope.firstVisibleItem = 0;

  //-----------------------------------------------------------------------------
  $scope.onPageChanged = function() {
    $scope.firstVisibleItem = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.albumIdx = -1;
    $scope.imageIdx = -1;
  };


  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onEditClicked = function(meal, $event){
    $event.stopPropagation();
    SharedInfos.set("mealInfo", { meal: meal, action : "edit" });
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.onMealClicked = function(f_meals, $index){
    for (i = 0; i < $scope.meals.length; i++)
      $scope.meals[i].active = null;
    f_meals[$index + $scope.firstVisibleItem].active = true;

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'ui_mealCarousel.html',
        controller: 'MealsCarouselController',
        size : 'md',
        resolve: {
          meals: function () {
            return f_meals;
          }
        }
      });

      modalInstance.result.then(function () {
      }, function () {
      });
  };

  //-----------------------------------------------------------------------------
  $scope.onDuplicateClicked = function(meal, $event){
    SharedInfos.set("mealInfo", { meal: meal, action : "new" });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Crea un nuovo pasto con ingredienti simili a "' + meal.name + '", poi aggiungilo al tuo ricettario cliccando su "Salva"'});
    $location.url('/calculator');
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(meal, $index, $event) {
    Meals.remove({id: meal._id}, function success() {
      $scope.meals.splice($index, 1);
      $scope.alert = { "type" : "warning", "msg" : "Pasto eliminato: " + meal.name};
    }, function failure(httpResponse) {
      $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };
}]);

//=============================================================================
// MealsCarouselController - controller for ui_mealCarousel.html
//=============================================================================

app.controller('MealsCarouselController', ['$scope', '$modalInstance', 'meals', function ($scope, $modalInstance, meals) {

  $scope.meals = meals;
  $scope.noImage = 'images/no-image.png';

  $scope.onCloseClicked = function () {
    $modalInstance.dismiss('close');
  };

}]);
