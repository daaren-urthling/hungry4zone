//=============================================================================
// PlannerController - controller for ui_planner.html
//=============================================================================

app.controller('PlannerController', ['$scope', 'SharedInfos', '$sessionStorage', function ($scope, SharedInfos, $sessionStorage) {

  // if (SharedInfos.has("cache.PlannerController")){
  //   $scope.items = SharedInfos.get("cache.PlannerController");
  // }
  // SharedInfos.set("cache.PlannerController", $scope.items);

  if ($sessionStorage.items) {
    $scope.items = $sessionStorage.items;
  } else {
    $scope.items = [];
    $sessionStorage.items =  $scope.items;
  }

  //-----------------------------------------------------------------------------
  $scope.onCloseAlert = function(){
    $scope.alert = null;
  };

  //-----------------------------------------------------------------------------
  $scope.onAddClicked = function(){
    $scope.items.push({ a : 0, b : "ciao "});
  };

  //-----------------------------------------------------------------------------
  $scope.onInspectClicked = function(){
    // if (SharedInfos.has("cache.PlannerController"))
    //   itm = SharedInfos.get("cache.PlannerController");
    //   SharedInfos.set("cache.PlannerController", itm);
    if ($sessionStorage.items)
      itm = $sessionStorage.items;
  };

}]);
