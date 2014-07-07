setReviewGrader.directive('navigable', function () {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      // up arrow -> go to previous card
      if (event.which === 38) {
        scope.$apply(function() {
          scope.$eval(attrs.prev);
        });
        event.preventDefault();
      }

      // down arrow -> go to next card
      if (event.which === 40) {
        scope.$apply(function() {
          scope.$eval(attrs.next);
        });
        event.preventDefault();
      }
    });
  }
});

