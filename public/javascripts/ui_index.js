var app = angular.module("hungry4zone", ['ngRoute', 'ngResource']);

//---------------
// Services
//---------------

app.factory('Foods', ['$resource', function($resource){
  Foods = $resource('/foods/:id', null, {
    'update': { method:'PUT' }
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

//---------------
// Controllers
//---------------

app.controller('FoodsController', ['$scope', 'Foods', '$location', function ($scope, Foods, $location) {
  $scope.foods = Foods.query();

  console.log('foods:',$scope.foods);

  $scope.add = function(){
    $location.url('/0');
  };
}]);

app.controller('FoodDetailController', ['$scope', '$routeParams', 'Foods', '$location', '$http', function ($scope, $routeParams, Foods, $location, $http) {
  if ($routeParams.id == "0") {
    $scope.isNew = true;
    $scope.food = new Foods();
  }
  else  {
    $scope.isNew = false;
    $scope.food = Foods.get({id: $routeParams.id });
  }

  $scope.foodTypes = [];
  $http.get('/foodTypes/').
    success(function(data, status, headers, config) {
      $scope.foodTypes = data;
      console.log('foodTypes:', data);
    });

  $scope.add = function(){
    if(!$scope.food.name || $scope.food.name.length < 1) return;

    $scope.food.$save(function(){
      $location.url('/');
    });
  };

  $scope.update = function(){
    Foods.update({id: $scope.food._id}, $scope.food, function(){
      $location.url('/');
    });
  };

  $scope.remove = function(){
    Foods.remove({id: $scope.food._id}, function(){
      $location.url('/');
    });
  };

  $scope.onFoodSourceChanged= function(){
    $scope.food.source = parseInt($scope.food.source);
  };
}]);

app.controller('UploadController', ['$scope', '$http', function ($scope, $http) {

  $scope.fileChanged = function(element) {
    $scope.file = element.files[0];
  };

  $scope.upload = function() {
    var reader = new FileReader();
    reader.onload = function(onLoadEvent) {
      console.log('caricato ', this.result);
      $http.post('/uploadFoods/', {data: this.result}).
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
