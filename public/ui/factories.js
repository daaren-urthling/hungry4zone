//=============================================================================
// Foods factory
//=============================================================================
app.factory('Foods', ['$resource', function($resource){

  Foods = $resource('/foods/:id', null, {
    'update': { method:'PUT' },
    'search': { method:'GET', url: '/foods/search/:name'},
    'upload': { method:'POST', url: '/foods/upload'}
  });

  //-----------------------------------------------------------------------------
  Foods.prototype.sourceImage = function() {
    switch (this.source) {
      case 1 : return "images/red.png";
      case 2 : return "images/yellow.png";
      case 3 : return "images/green.png";
    }
    return "";
  };

  //-----------------------------------------------------------------------------
  Foods.find = function (foods, name) {
    for (i = 0; i < foods.length; i++) {
      if (foods[i].name == name)
        return foods[i];
    }
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
    'signup': { method:'PUT', url: '/users/signup'},
    'checkEmail': { method:'PUT', url: '/users/checkEmail'},
    'loggedUser': { method:'PUT', url: '/users/loggedUser'},
    'login': { method:'PUT', url: '/users/login'},
    'logout': { method:'PUT', url: '/users/logout'},
    'forgotPassword': { method:'PUT', url: '/users/forgotPassword'},
    'validatePin': { method:'PUT', url: '/users/validatePin'},
    'changePassword': { method:'PUT', url: '/users/changePassword'},
  });

  return User;
}]);

//=============================================================================
// MealItems factory
//=============================================================================
app.factory('MealItems', ['Foods', function(Foods){

  //-----------------------------------------------------------------------------
  function MealItems() {
    this.qty              = 0.0;
    this.totProteins      = 0.0;
    this.totFats          = 0.0;
    this.totCarbohydrates = 0.0;
    this.food             = new Foods();
    this.food.name = "";
  }

  //-----------------------------------------------------------------------------
  MealItems.prototype.adjustLocale = function () {

    function adjustNumberLocale(literal) {
      if (!literal) return 0.0;
      if (typeof(literal) == "number") return literal;
      if (typeof(literal) != "string") return 0.0;
      return literal.replace(',','.');
    }

    this.qty = adjustNumberLocale(this.qty);
  };


  return MealItems;
}]);

//=============================================================================
// Meals factory
//=============================================================================
app.factory('Meals', ['$http', 'MealItems', function($http, MealItems){

  //-----------------------------------------------------------------------------
  function Meals() {
    this.name = "";
    this.totalCalories = 0;

    Object.defineProperty(this, "minLength", { get: function () { return 5; } });

    emptyMeal = { qty: 0.0, totProteins: 0.0, totFats: 0.0, totCarbohydrates: 0.0 };
    this.mealItems = [];
    for (m = 0; m < this.minLength; m++)
      this.mealItems.push(new MealItems());
  }

  //-----------------------------------------------------------------------------
  Meals.cacheRetrieve = function(callback) {
    $http.get('/mealCache').success(function(result) {
                callback(result);
            });
  };

  //-----------------------------------------------------------------------------
  Meals.cacheItem = function(data) {
    $http.put('/mealCache/cacheItem', data);
  };

  //-----------------------------------------------------------------------------
  Meals.removeItem = function(data) {
    $http.put('/mealCache/removeItem', data);
  };

  //-----------------------------------------------------------------------------
  Meals.removeAll = function() {
    $http.put('/mealCache/removeAll');
  };

  return Meals;
}]);

// Merge function, if angular < 1.4 is used
// //-----------------------------------------------------------------------------
// function merge(obj1,obj2){ // Our merge function
//     var result = {}; // return result
//     for(var i in obj1){      // for every property in obj1
//         if((i in obj2) && (typeof obj1[i] === "object") && (i !== null)){
//             result[i] = merge(obj1[i],obj2[i]); // if it's an object, merge
//         }else{
//            result[i] = obj1[i]; // add it to result
//         }
//     }
//     for(i in obj2){ // add the remaining properties from object 2
//         if(i in result){ //conflict
//             continue;
//         }
//         result[i] = obj2[i];
//     }
//     return result;
// }
