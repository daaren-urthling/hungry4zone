//=============================================================================
// Foods factory
//=============================================================================
app.factory('Foods', ['$resource', function($resource){

  foodsResource = $resource('/foods/:id', null, {
    'update': { method:'PUT' },
    'search': { method:'GET', url: '/foods/search/:name'},
    'upload': { method:'POST', url: '/foods/upload'}
  });

  Foods = function() {
    foodsResource.call(this, {
      name          : "",
      type          : "",
      source        : 0,
      proteins      : 0.0,
      fats          : 0.0,
      carbohydrates : 0.0,
    });
  };
  Foods.prototype = Object.create(foodsResource.prototype);

  Foods.query = function(a1, a2, a3, a4) {
    Foods.foods = foodsResource.query(a1, a2, a3, a4);
    return Foods.foods;
  };

  Foods.foods = [];

  // wrap the parent resource functions to call them easily
  //-----------------------------------------------------------------------------
  Foods.get = foodsResource.get;
  Foods.search = foodsResource.search;
  Foods.update = foodsResource.update;
  Foods.upload = foodsResource.upload;

  //-----------------------------------------------------------------------------
  Foods.find = function (id) {
    for (i = 0; i < Foods.foods.length; i++) {
      if (Foods.foods[i]._id == id)
        return Foods.foods[i];
    }
    return new Foods();
  };

  //-----------------------------------------------------------------------------
  Foods.sourceImage = function(food) {
    if (food)
      switch (food.source) {
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

  // as FoodTypes is a small read-only table, preload a copy of it
  FoodTypes.foodTypes = [];
  FoodTypes.query({}, function success(result){
    FoodTypes.foodTypes = result;
  });

  //-----------------------------------------------------------------------------
  FoodTypes.find = function (type) {
    for (i = 0; i < FoodTypes.foodTypes.length; i++) {
      if (FoodTypes.foodTypes[i].type == type)
        return FoodTypes.foodTypes[i];
    }
    return null;
  };

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
  }

  //-----------------------------------------------------------------------------
  MealItems.adjustLocale = function (mealItem) {

    function adjustNumberLocale(literal) {
      if (!literal) return 0.0;
      if (typeof(literal) == "number") return literal;
      if (typeof(literal) != "string") return 0.0;
      return literal.replace(',','.');
    }

    mealItem.qty = adjustNumberLocale(mealItem.qty);
  };


  return MealItems;
}]);

//=============================================================================
// Meals factory
//=============================================================================
app.factory('Meals', ['$resource', 'MealItems', '$http', 'Foods', function($resource, MealItems, $http, Foods){

  //-----------------------------------------------------------------------------
  Meals = function() {
    mealResource.call(this, {
      name : "",
      mealItems : [],
      blockProteins : 0,
      blockFats : 0,
      blockCarbohydrates : 0,
      blocks : 0,
      totCalories : 0,
      userId : null
    });
  };

  Meals.timestamp = null;
  //-----------------------------------------------------------------------------
  function forceCacheInvalidate() {
    Meals.timestamp = new Date().getTime();
  }
  forceCacheInvalidate();

  mealResource = $resource('/meals/:id', null, {
    'query' : { method : 'GET', isArray:true, cache: false, url: '/meals/?at='+ Meals.timestamp},
    'update': { method:'PUT' },
    'search': { method:'GET', url: '/meals/search/:name'},
  });

  Meals.prototype = Object.create(mealResource.prototype);

  Meals.minLength = 5;

  //-----------------------------------------------------------------------------
  Meals.update = function() {
    forceCacheInvalidate();
    return mealResource.update.apply(this, arguments);
  };

  //-----------------------------------------------------------------------------
  Meals.save = function() {
    forceCacheInvalidate();
    return mealResource.save.apply(this, arguments);
  };

  //-----------------------------------------------------------------------------
  Meals.remove = function() {
    forceCacheInvalidate();
    return mealResource.remove.apply(this, arguments);
  };

  // wrap the parent resource functions to call them easily
  //-----------------------------------------------------------------------------
  // Meals.save = mealResource.save;
  Meals.query = mealResource.query;
  Meals.search = mealResource.search;
  // Meals.update = mealResource.update;
  // Meals.remove = mealResource.remove;

  //-----------------------------------------------------------------------------
  Meals.reconnectFoods = function(meal) {
    // avoid in-loop function declaration
    var getFood = function(id, idx) {
      Foods.get({id: id}, function success(result) {
        meal.mealItems[idx].food = result;
      });
    };

    meal.mealItems.forEach(function(mealItem, idx){
      if (mealItem.food._id) {
        id = mealItem.food._id;
      } else if (typeof mealItem.food === "string") {
        id = mealItem.food;
      } else {
        return;
      }
      // access the local cache if available
      if (Foods.foods.length > 0)
        meal.mealItems[idx].food = Foods.find(id);
      else
        getFood(id, idx);
    });
  };

  //-----------------------------------------------------------------------------
  Meals.adjustTail = function(meal) {
    // add an empty slot if already full
    if (meal.mealItems.length >= Meals.minLength && meal.mealItems[meal.mealItems.length - 1].food.name !== "")
      meal.mealItems.push(new MealItems());
    // add as many slots to arrive up to the minimum
    else
      for (i = meal.mealItems.length; i < Meals.minLength; i++)
        meal.mealItems.push(new MealItems());
  };

  //-----------------------------------------------------------------------------
  Meals.removeTail = function(meal) {
    // remove extra empty lines at the bottom
    for (i = meal.mealItems.length - 1; i > 0; i--)
      if (meal.mealItems[i].food.name === "")
        meal.mealItems.splice(i);
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
