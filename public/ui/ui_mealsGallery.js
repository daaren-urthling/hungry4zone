//=============================================================================
// MealsGalleryController - controller for ui_mealsGallery.html
//=============================================================================

app.controller('MealsGalleryController', ['$scope', 'SharedInfos', 'Meals', 'Foods', '$location', 'Picasa', '$modal', '$sessionStorage', 'MealTags', '$timeout', function ($scope, SharedInfos, Meals, Foods, $location, Picasa, $modal, $sessionStorage, MealTags, $timeout) {

  $scope.noImage = 'images/no-image.png';

  $scope.meals = Meals.query({}, function() {
    $scope.meals.forEach (function(meal, idx) {
      $scope.meals[idx].originalIdx = idx; // useful for delete
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

  $scope.tags = [];
  if (SharedInfos.has("pickInfo"))  {
    $scope.pickInfo = SharedInfos.get("pickInfo");
    $scope.tags.push({ "text" : $scope.pickInfo.kind});
  }

  $scope.currentPage = 1;
  $scope.itemsPerPage = 6;
  $scope.firstVisibleItem = 0;
  $scope.maxMealItems = 8;

  //-----------------------------------------------------------------------------
  $scope.loadTags = function($query) {
    return MealTags.filter(function(tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
  };

  //-----------------------------------------------------------------------------
  $scope.isOwner = function(meal) {
    return  $sessionStorage.loggedUser &&
            (
              $sessionStorage.loggedUser.isAdmin ||
              meal.userId === $sessionStorage.loggedUser.id
            );
  };

  //-----------------------------------------------------------------------------
  $scope.tagsList = function(meal){
    var list = "";
    meal.tags.forEach(function(tag) {
      list = list + tag.text + ", ";
    });
    if (list.length > 2)
      return list.substring(0,list.length - 2);
    else
      return "";
  };

  //-----------------------------------------------------------------------------
  $scope.onPageChanged = function() {
    $scope.firstVisibleItem = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.albumIdx = -1;
    $scope.imageIdx = -1;
    $scope.onGalleryCompleted(0);
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
      $scope.meals.splice(meal.originalIdx, 1);
      $scope.f_meals.splice($index, 1);
      $scope.alert = { "type" : "warning", "msg" : "Pasto eliminato: " + meal.name};
    }, function failure(httpResponse) {
      $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onPickMealClicked = function(meal, $event) {
    if ($event)
      $event.stopPropagation();
    if (!$scope.pickInfo.meal || $scope.pickInfo.meal._id != meal._id) {
      $scope.pickInfo.meal = meal;
    }
    else {
      $scope.pickInfo.meal = null;
    }
  };

  //-----------------------------------------------------------------------------
  $scope.onPickConfirmClicked = function() {
    SharedInfos.set("pickInfo", $scope.pickInfo);
    $location.url('/planner');
  };

  //-----------------------------------------------------------------------------
  $scope.onPickCancelClicked = function() {
    $location.url('/planner');
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
          },
          pickInfo: function () {
            return $scope.pickInfo;
          }
}
      });

      modalInstance.result.then(function (result) {
        switch (result.action) {
          case "edit" : $scope.onEditClicked(result.meal); break;
          case "duplicate" : $scope.onDuplicateClicked(result.meal); break;
          case "remove" : $scope.onRemoveClicked(result.meal, result.idx); break;
          case "pick" : $scope.pickInfo.meal = result.meal;
        }
      }, function () {
      });
  };

  //-----------------------------------------------------------------------------
  $scope.onGalleryCompleted = function(delay) {
    if (delay === undefined)
      delay = 1000;
    $timeout(function() {
        $scope.$broadcast('galleryCompleted');
    }, delay); // need some timeout or won't work always on a fast browser
  };

}]);

//=============================================================================
// MealsCarouselController - controller for ui_mealCarousel.html
//=============================================================================

app.controller('MealsCarouselController', ['$scope', 'Foods', '$modalInstance', 'meals', 'isOwner', 'pickInfo', function ($scope, Foods, $modalInstance, meals, isOwner, pickInfo) {

  $scope.meals = meals;
  $scope.noImage = 'images/no-image-md.png';
  $scope.servings = 1;
  $scope.pickInfo = pickInfo;

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
  $scope.RecipeURL = function() {
    meal = currentMeal();
    if (meal) return meal.recipeURL;
  };

  //-----------------------------------------------------------------------------
  $scope.onActionClicked = function(action){
    var idx = -1;
    $modalInstance.close({action : action, meal : currentMeal(), idx : idx});
  };

  //-----------------------------------------------------------------------------
  $scope.onServingsClicked = function(meal, sign) {
    console.log(sign);
    if (sign === '+')
      $scope.servings++;
    else if (sign === '-' && $scope.servings > 1)
      $scope.servings--;

    meal.mealItems.forEach(function(item){
      item.totQty = item.qty * $scope.servings;
    });
  };

}]);

//=============================================================================
// h4zCheckOverflow - drective to show an overflow indicator on a table
//=============================================================================

app.directive('h4zCheckOverflow',[ '$window',  function($window) {
    return function(scope, elm, attr) {

      // when the rendering of the gallery is completed, set the overflow
      // marker to show or stay hidden
      scope.$on('galleryCompleted', function (event, data) {
        scope[attr.h4zCheckOverflow] = (elm[0].scrollHeight > elm[0].offsetHeight);
      });

      // register to the window resizing event, to check if lines in the tables
      // are wrapping
      angular.element($window).bind("resize",function(){
        isOverflow = (elm[0].scrollHeight > elm[0].offsetHeight);
        // $apply only if the overflow condition has changed
        if (scope[attr.h4zCheckOverflow] != isOverflow){
            scope[attr.h4zCheckOverflow] = isOverflow;
            scope.$apply();
        }
      });

    };
}]);
