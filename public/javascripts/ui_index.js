var app = angular.module("hungry4zone", ['ngRoute', 'ngResource']);

//---------------
// Services
//---------------

//=============================================================================
// Foods factory
//=============================================================================
app.factory('Foods', ['$resource', function($resource){
  Foods = $resource('/foods/:id', null, {
    'update': { method:'PUT' },
    'search': { method:'GET', url: '/foods/search/:name'},
    'upload': { method:'POST', url: '/foods/upload'}
  });
  Foods.prototype.sourceImage = function() {
    switch (this.source) {
      case 1 : return "images/red.png";
      case 2 : return "images/yellow.png";
      case 3 : return "images/green.png";
    }
    return "";
  };

  return Foods;
}]);

//=============================================================================
// FoodTypes factory
//=============================================================================
app.factory('FoodTypes', ['$resource', function($resource){
  FoodTypes = $resource('/foodTypes/:id', null, {
  });
  return FoodTypes;
}]);

//---------------
// Controllers
//---------------

//=============================================================================
// FoodsController
//=============================================================================
app.controller('FoodsController', ['$scope', 'Foods', '$location', function ($scope, Foods, $location) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $location.url('/0');
  };
}]);

//=============================================================================
// FoodDetailController
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

//=============================================================================
// UploadController
//=============================================================================
app.controller('UploadController', ['$scope', 'Foods', function ($scope, Foods) {

  //-----------------------------------------------------------------------------
  $scope.onFileChanged = function(element) {
    $scope.file = element.files[0];
  };

  //-----------------------------------------------------------------------------
  $scope.onUploadClicked = function() {
    var reader = new FileReader();
    reader.onload = function(onLoadEvent) {
      console.log('caricato ', this.result);
      Foods.upload({data: this.result}).
        success(function(data, status, headers, config) {
          console.log('posted');
        });
		};
    reader.readAsText($scope.file);
  };
}]);

//---------------
// Routes
//---------------

//=============================================================================
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/foods.html',
      controller: 'FoodsController'
    })
    .when('/upload', {
      templateUrl: '/upload.html',
      controller: 'UploadController'
    })
    .when('/:id', {
      templateUrl: '/foodDetails.html',
      controller: 'FoodDetailController'
    });
}]);
