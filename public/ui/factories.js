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

//=============================================================================
// Users factory
//=============================================================================
app.factory('Users', ['$resource', function($resource){
  User = $resource('/users/:id', null, {
    'login': { method:'PUT', url: '/users/login'},
    'loggedUser': { method:'GET', url: '/users/loggedUser'},
  });
  return User;
}]);

//=============================================================================
// Meals factory
//=============================================================================
app.factory('Meals', ['$http', function($http){
  function Meals() {
    this.name = "";
    this.totalCalories = 0;

    Object.defineProperty(this, "minLength", { get: function () { return 5; } });

    emptyMeal = { qty: 0.0, totProteins: 0.0, totFats: 0.0, totCarbohydrates: 0.0 };
    this.mealItems = [];
    for (m = 0; m < this.minLength; m++)
      this.mealItems.push({ qty: 0.0, totProteins: 0.0, totFats: 0.0, totCarbohydrates: 0.0 });

  }

  Meals.cacheRetrieve = function(callback) {
    $http.get('/mealCache').success(function(result) {
                if (result.data) {
                  for (m = result.data.mealItems.length; m < 5; m++ )
                    result.data.mealItems.push({ qty: 0.0, totProteins: 0.0, totFats: 0.0, totCarbohydrates: 0.0 });
                }
                callback(result);
            });
  };

  Meals.cacheItem = function(mealItem) {
    $http.put('/mealCache/cacheItem', mealItem);
  };

  return Meals;
}]);
