//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', '$location', 'Picasa', '$modal', '$sessionStorage', function ($scope, SharedInfos, Meals, Foods, $location, Picasa, $modal, $sessionStorage) {

  $scope.noImage = 'images/no-image.png';

  $scope.meals = Meals.query({}, function() {
    $scope.meals.forEach (function(meal, idx) {
      Meals.reconnectFoods($scope.meals[idx]);
      if ($scope.meals[idx].imageCoord) {
        Picasa.getImageURL($scope.meals[idx].imageCoord, [128, 200]).then(function(imageURLs) {
          $scope.meals[idx].imageURL = imageURLs[0];
          $scope.meals[idx].bigImageURL = imageURLs[1];
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
  $scope.maxMealItems = 8;

  //-----------------------------------------------------------------------------
  $scope.isOwner = function(meal) {
    return  $sessionStorage.loggedUser &&
            (
              $sessionStorage.loggedUser.isAdmin ||
              meal.userId === $sessionStorage.loggedUser.id
            );
  };

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
    if ($event)
      $event.stopPropagation();
    SharedInfos.set("mealInfo", { meal: meal, action : "edit" });
    $location.url('/meal');
  };

  //-----------------------------------------------------------------------------
  $scope.onDuplicateClicked = function(meal, $event){
    if ($event)
      $event.stopPropagation();
    SharedInfos.set("mealInfo", { meal: meal, action : "new" });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Crea un nuovo pasto con ingredienti simili a "' + meal.name + '", poi aggiungilo al tuo ricettario cliccando su "Salva"'});
    $location.url('/calculator');
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(meal, $index, $event) {
    if ($event)
      $event.stopPropagation();
    Meals.remove({id: meal._id}, function success() {
      $scope.meals.splice($index, 1);
      $scope.alert = { "type" : "warning", "msg" : "Pasto eliminato: " + meal.name};
    }, function failure(httpResponse) {
      $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
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
          },
          isOwner: function () {
            return $scope.isOwner;
          }
        }
      });

      modalInstance.result.then(function (result) {
        switch (result.action) {
          case "edit" : $scope.onEditClicked(result.meal); break;
          case "duplicate" : $scope.onDuplicateClicked(result.meal); break;
          case "remove" : $scope.onRemoveClicked(result.meal, result.idx); break;
        }
      }, function () {
      });
  };

}]);

//=============================================================================
// MealsCarouselController - controller for ui_mealCarousel.html
//=============================================================================

app.controller('MealsCarouselController', ['$scope', 'Foods', '$modalInstance', 'meals', 'isOwner', function ($scope, Foods, $modalInstance, meals, isOwner) {

  $scope.meals = meals;
  $scope.noImage = 'images/no-image-md.png';

  //-----------------------------------------------------------------------------
  function currentMeal() {
    meal = $scope.meals.filter(function(m, i){
      if (m.active) {
        idx = i;
        return true;
      } else {
        return false;
      }
    });

    if (meal.length > 0) {
      return meal[0];
    }
    else {
      return null;
    }
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseClicked = function () {
    $modalInstance.dismiss('close');
  };

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.isOwner = function(meal) {
    return isOwner(currentMeal());
  };

  //-----------------------------------------------------------------------------
  $scope.onActionClicked = function(action){
    var idx = -1;
    $modalInstance.close({action : action, meal : currentMeal(), idx : idx});
  };

}]);
