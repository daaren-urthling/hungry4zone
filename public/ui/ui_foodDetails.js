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
    if(!$scope.food.name || $scope.food.name.length < 1) return;

    $scope.food.$save(function(result){
      if (!result.success && result.id)
        $scope.alertMessage = 'Alimento già presente';
      else
        $location.url('/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onUpdateClicked = function(){
    Foods.update({id: $scope.food._id}, $scope.food, function(){
      $location.url('/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onRemoveClicked = function(){
    Foods.remove({id: $scope.food._id}, function(){
      $location.url('/');
    });
  };

  //-----------------------------------------------------------------------------
  $scope.onFoodNameChanged = function(){
    $scope.alertMessage ='';
    if (!$scope.isNew) return;

    Foods.search({name: $scope.food.name },
      function(result) {
        console.log('done: ', result);
        if (result.success)
          $scope.alertMessage = 'Alimento già presente';
      },
      function(httpResponse) {
        console.log('something wrong: ', httpResponse);
      });
  };

//-----------------------------------------------------------------------------
  $scope.onFoodSourceChanged= function(){
    $scope.food.source = parseInt($scope.food.source);
  };
}]);
