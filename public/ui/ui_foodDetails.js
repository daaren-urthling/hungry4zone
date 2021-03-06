//=============================================================================
// FoodDetailController - controller for ui_foodDetails.html
//=============================================================================

app.controller('FoodDetailController', ['$scope', '$routeParams', 'Foods', '$location', 'FoodTypes', '$resource', 'SharedInfos', function ($scope, $routeParams, Foods, $location, FoodTypes, $resource, SharedInfos) {
  if ($routeParams.id == "0") {
    $scope.isNew = true;
    $scope.food = new Foods();
  }
  else  {
    $scope.isNew = false;
    $scope.food = Foods.get({id: $routeParams.id });
  }

  $scope.foodTypes = FoodTypes.query();

  //-----------------------------------------------------------------------------
  $scope.sourceImage = function(food)  {
    return Foods.sourceImage(food);
  };

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    if(!$scope.food.name || $scope.food.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome dell\'alimento'};
      return;
    }

    $scope.food.$save(function() { // success
        SharedInfos.set("alert", { "type" : "success", "msg" : "Inserito un nuovo alimento: " + $scope.food.name});
        $location.url('/foods/');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    $scope.food.$update({id: $scope.food._id}, function() {  // success
      SharedInfos.set("alert", { "type" : "success", "msg" : "Alimento modificato: " + $scope.food.name});
      $location.url('/foods/');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    $scope.food.$remove({id: $scope.food._id}, function(){ // success
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Alimento eliminato: " + $scope.food.name});
      $location.url('/foods/');
    }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onFoodNameChanged = function(){
    $scope.alert = null;
    if (!$scope.isNew) return;

    Foods.search({name: $scope.food.name }, function(result) { // success
        if (result._id)
          $scope.alert = { type : "danger", msg : 'Alimento già presente'};
      }, function(httpResponse) { // failure
        $scope.alert = { type : "danger", msg :GetErrorMessage(httpResponse) };
      });
  };

//-----------------------------------------------------------------------------
  $scope.onFoodSourceChanged= function(){
    $scope.food.source = parseInt($scope.food.source);
  };
  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };
}]);
