setReviewGrader.directive('gradeable', function () {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      var grades = ['F', 'D', 'C', 'B', 'A'];
      var direction;

      // left arrow -> decrease grade
      if (event.which === 37) {
        direction = -1;
      }
      // right arrow -> increase grade
      if (event.which === 39) {
        direction = 1;
      }

      if (typeof(direction) != 'undefined') {
        var newGrade = grades[grades.indexOf(scope.currentCard.grade) + direction];
        if (typeof(newGrade) != 'undefined') {
          scope.currentCard.grade = newGrade;

          var image = document.getElementById('currentCard');
          var newGradeLocation = document.getElementById('grade' + newGrade);
          newGradeLocation.appendChild(image);
        }
      }
    });
  }
});

