//=============================================================================
// MealController - controller for ui_meal.html
//=============================================================================

app.controller('MealController', ['$scope', 'SharedInfos', '$location', 'Meals', '$sessionStorage', 'MealTags', 'FireStorage', function ($scope, SharedInfos, $location, Meals, $sessionStorage, MealTags, FireStorage) {

  $scope.noImage = 'images/no-image-big.png';

  if (SharedInfos.has("mealInfo"))  {
    mealInfo = SharedInfos.get("mealInfo");
    $scope.meal = mealInfo.meal;
    $scope.isNew = (mealInfo.action === "new");
    $scope.canRemove = !mealInfo.noRemove;
    if ($scope.isNew) {
      if ($sessionStorage.loggedUser)
        if ($sessionStorage.loggedUser.isAdmin)
          $scope.meal.userId = null; // null user id means public meal
        else
          $scope.meal.userId = $sessionStorage.loggedUser.id;
      $scope.meal._id = null;
      $scope.meal.imageCoord = null;
      $scope.meal.name = "";
    }
  } else if ($sessionStorage.MealController) {
    $scope.meal = $sessionStorage.MealController.meal;
    $scope.isNew = $sessionStorage.MealController.isNew;
    $scope.canRemove = $sessionStorage.canRemove;
  } else {
    $scope.isNew = true;
    $scope.meal = new Meals();
  }

  $sessionStorage.MealController = { meal: $scope.meal, isNew: $scope.isNew, canRemove: $scope.canRemove };

  if (SharedInfos.has("imagePickerInfo"))  {
    imagePickerInfo = SharedInfos.get("imagePickerInfo");
    $scope.meal.imageCoord = imagePickerInfo.imageCoord;
  }

  //-----------------------------------------------------------------------------
  function showImage() {
    if ($scope.meal.imageCoord) {
      FireStorage.getImageURL($scope.meal.imageCoord, FireStorage.SZ_LARGE).then(function success(imageUrl) {
          $scope.imageURL = imageUrl;
      }, function failure(response) {
        console.log(response);
      });
    }
  }
  showImage();

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.loadTags = function($query) {
    return MealTags.filter(function(tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
  };

  function returnToDefaultPage(cancel) {
    if (SharedInfos.has("returnTo")) {
      var returnTo = SharedInfos.get("returnTo");
      if (!cancel) {
        SharedInfos.set("mealInfo", { meal: $scope.meal, action : ($scope.isNew ? "new" : "edit") });
      }
      $location.url(returnTo);
    } else {
      if ($scope.isNew) {
        SharedInfos.set("mealInfo", { meal: $scope.meal, action : "new" });
        $location.url('/calculator');
      }
      else
        $location.url('/mealsGallery');
    }
  }

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    if(!$scope.meal.name || $scope.meal.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome del pasto'};
      return;
    }

    Meals.save($scope.meal, function success(result) {
        SharedInfos.set("alert", { "type" : "success", "msg" : "inserito un nuovo pasto: " + $scope.meal.name});
        delete $sessionStorage.MealController;
        // retrieve the new meal id
        Meals.search({name: $scope.meal.name }, function(result) { // success
          $scope.meal._id  = result._id;
          returnToDefaultPage();
        }, function(httpResponse) { // failure
          $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
        });
    }, function failure(httpResponse) {
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

    Meals.update({id: $scope.meal._id}, $scope.meal, function success(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Pasto modificato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      returnToDefaultPage();
    }, function failure(httpResponse) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    Meals.remove({id: $scope.meal._id}, function success(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Pasto eliminato: " + $scope.meal.name});
      delete $sessionStorage.MealController;
      returnToDefaultPage();
    }, function failure(httpResponse) {
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onCancelClicked = function(){
    // after cancel the cache is no longer needed
    delete $sessionStorage.MealController;
    returnToDefaultPage(true);
  };

  //-----------------------------------------------------------------------------
  $scope.onChangeIngredientsClicked = function(){
    SharedInfos.set("mealInfo", { meal: $scope.meal, action : "edit", noRemove: !$scope.canRemove });
    SharedInfos.set("alert", { "type" : "success", "msg" : 'Modifica gli alimenti di "' + $scope.meal.name + '", poi aggiorna il tuo ricettario cliccando su "Continua"'});
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
  $scope.onPickImageClicked = function(){
    SharedInfos.set("imagePickerInfo", { returnTo : "/meal", name: $scope.meal.name });
    $location.url('/imagePicker');
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveImageClicked = function(){
    $scope.meal.imageCoord = null;
    $scope.imageURL = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onRefreshImageClicked = function(){
    showImage();
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

}]);
