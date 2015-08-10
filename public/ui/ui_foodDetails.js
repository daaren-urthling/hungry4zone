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
      {
        SharedInfos.set("alert", { "type" : "success", "msg" : "Inserito un nuovo alimento: " + newFood});
        $location.url('/foods/');
      }
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    var changedFood = $scope.food.name;

    Foods.update({id: $scope.food._id}, $scope.food, function(){
      SharedInfos.set("alert", { "type" : "success", "msg" : "Alimento modificato: " + changedFood});
      $location.url('/foods/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){

    var removedFood = $scope.food.name;

    Foods.remove({id: $scope.food._id}, function(){
      SharedInfos.set("alert", { "type" : "warning", "msg" : "Alimento eliminato: " + removedFood});
      $location.url('/foods/');
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
