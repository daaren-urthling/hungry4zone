var app = angular.module("hungry4zone", ['ngRoute', 'ngResource']);

//---------------
// Services
//---------------

app.factory('Foods', ['$resource', function($resource){
  Foods = $resource('/foods/:id', null, {
    'update': { method:'PUT' }
  });
  Foods.prototype.sourceImage = function() {
    console.log('sourceImage', this.source);
    switch (this.source) {
      case 1 : return "images/red.png";
      case 2 : return "images/yellow.png";
      case 3 : return "images/green.png";
    }
  };
  return Foods;
}]);

//---------------
// Controllers
//---------------

app.controller('FoodsController', ['$scope', 'Foods', function ($scope, Foods) {
  $scope.foods = Foods.query();

  console.log($scope.foods);

  $scope.save = function(){
    if(!$scope.newFood || $scope.newFood.length < 1) return;
    var food = new Foods({ name: $scope.newFood });

    food.$save(function(){
      $scope.foods.push(food);
      $scope.newFood = ''; // clear textbox
    });
  };

}]);

app.controller('FoodDetailController', ['$scope', '$routeParams', 'Foods', '$location', '$http', function ($scope, $routeParams, Foods, $location, $http) {
  $scope.food = Foods.get({id: $routeParams.id });

  $scope.foodTypes = [];
  $http.get('/foodTypes/').
    success(function(data, status, headers, config) {
      $scope.foodTypes = data;
      console.log(data);
    });

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
    .when('/:id', {
      templateUrl: '/foodDetails.html',
      controller: 'FoodDetailController'
   });
}]);
