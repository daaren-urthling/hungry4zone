//=============================================================================
// FoodDetailController - controller for ui_foodDetails.html
//=============================================================================

app.controller('FoodDetailController', ['$scope', '$routeParams', 'Foods', '$location', 'FoodTypes', '$resource', function ($scope, $routeParams, Foods, $location, FoodTypes, $resource) {
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
  $scope.onAddClicked = function(){
    if(!$scope.food.name || $scope.food.name.length < 1)
    {
      $scope.alert = { type : "danger", msg : 'Indicare il nome dell\'alimento'};
      return;
    }

    var newFood = $scope.food.name;

    $scope.food.$save(function(result){
      if (!result.success && result.id)
        $scope.alert = { type : "danger", msg : 'Alimento già presente'};
      else
        $location.url('/foods/'+ angular.toJson({ "type" : "success", "msg" : "Inserito un nuovo alimento: " + newFood}));
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    var changedFood = $scope.food.name;

    Foods.update({id: $scope.food._id}, $scope.food, function(){
      $location.url('/foods/'+ angular.toJson({ "type" : "success", "msg" : "Alimento modificato: " + changedFood}));
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){

    var removedFood = $scope.food.name;

    Foods.remove({id: $scope.food._id}, function(){
      $location.url('/foods/'+ angular.toJson({ "type" : "warning", "msg" : "Alimento eliminato: " + removedFood}));
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onFoodNameChanged = function(){
    $scope.alert = null;
    if (!$scope.isNew) return;

    Foods.search({name: $scope.food.name },
      function(result) {
        if (result.success)
          $scope.alert = { type : "danger", msg : 'Alimento già presente'};
      },
      function(httpResponse) {
        console.log('something wrong: ', httpResponse);
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
