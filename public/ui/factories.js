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
  Foods.find = function (foods, food) {
    if (food._id) {
      id = food._id;
    } else if (typeof food === "string") {
      id = food;
    } else {
      return null;
    }
    for (i = 0; i < foods.length; i++) {
      if (foods[i]._id == id)
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
app.factory('Meals', ['$resource', 'MealItems', '$http', 'Foods',function($resource, MealItems, $http, Foods){

  mealResource = $resource('/meals/:id', null, {
    'update': { method:'PUT' },
    'search': { method:'GET', url: '/meals/search/:name'},
  });

  //-----------------------------------------------------------------------------
  Meals = function() {
    mealResource.call(this, {
      name : "",
      mealItems : [],
      totCalories : 0,
      userId : null,
    });
  };
  Meals.prototype = Object.create(mealResource.prototype);

  Meals.prototype.minLength = 5;

  // wrap the parent resource functions to call them easily
  //-----------------------------------------------------------------------------
  Meals.query = mealResource.query;
  Meals.search = mealResource.search;
  Meals.update = mealResource.update;

  //-----------------------------------------------------------------------------
  Meals.cacheRetrieve = function(callback) {
    $http.get('/meals/cacheRetrieve').success(function(result) {
                callback(result);
            });
  };

  //-----------------------------------------------------------------------------
  Meals.cacheItem = function(data) {
    $http.put('/meals/cacheItem', data);
  };

  //-----------------------------------------------------------------------------
  Meals.removeCachedItem = function(data) {
    $http.put('/meals/removeCachedItem', data);
  };

  //-----------------------------------------------------------------------------
  Meals.removeAllCache = function() {
    $http.put('/meals/removeAllCache');
  };

  //-----------------------------------------------------------------------------
  Meals.reconnectFoods = function(meal, foods) {
    meal.mealItems.forEach(function(mealItem, idx){
      food = Foods.find(foods, mealItem.food);
      if (food)
        mealItem.food = food;
    });
  };

  //-----------------------------------------------------------------------------
  Meals.prototype.adjustTail = function() {
    // add an empty slot if already full
    if (this.mealItems.length >= this.minLength && this.mealItems[this.mealItems.length - 1].food.name !== "")
      this.mealItems.push(new MealItems());
    // add as many slots to arrive up to the minimum
    else
      for (i = this.mealItems.length; i < this.minLength; i++)
        this.mealItems.push(new MealItems());
  };

  //-----------------------------------------------------------------------------
  Meals.prototype.removeTail = function() {
    // remove extra empty lines at the bottom
    for (i = this.mealItems.length - 1; i > 0; i--)
      if (this.mealItems[i].food.name === "")
        this.mealItems.splice(i);
  };

  //-----------------------------------------------------------------------------
  Meals.prototype.reconnectFoods = function(foods) {
    Meals.reconnectFoods(this, foods);
  };

  return Meals;
}]);


// Merge function, if angular < 1.4 is used
//-----------------------------------------------------------------------------
// function angular_merge(obj1,obj2){ // Our merge function
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
