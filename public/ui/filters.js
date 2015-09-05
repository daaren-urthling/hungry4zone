//=============================================================================
// withTags - filter for tags in meals
//=============================================================================
app.filter('withTags', function () {
  return function (meals, queryTags) {
    if (!queryTags)
      return meals;
    var filtered = [];
    (meals || []).forEach(function (meal) {
        var matches = queryTags.every(function (queryTag) {
            return meal.tags.some(function (tag) {
              return tag.text === queryTag.text;
            });
        });
        if (matches) {
            filtered.push(meal);
        }
    });
    return filtered;
  };
});

//=============================================================================
// startFrom - filter for paginate items
//=============================================================================
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});
