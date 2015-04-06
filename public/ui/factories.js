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
