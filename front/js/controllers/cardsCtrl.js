setReviewGrader.controller('cardsCtrl', function ($scope, $localStorage, cardsService) {

  // https://github.com/gsklee/ngStorage
  $scope.$storage = $localStorage;

  $scope.cardsByColor = cardsService.initializeCardsByColor();
  $scope.colors = Object.keys($scope.cardsByColor);

  cardsService.fetchData().then(function(data) {
    $scope.set = cardsService.set(data);
    cardsService.groupCardsByColor($scope.cardsByColor, data.cards);
    $scope.setCard('White', $scope.cardsByColor.White[0]);
  });

  $scope.setCard = function(color, card) {
    // If previous card has not been graded:
    //   set grade, mark as graded, inc count
    if ($scope.currentCard && !$scope.currentCard.graded) {
      $scope.gradeCard('C');
    }
    $scope.currentColor = color;
    $scope.currentCard = card;
  };

  $scope.gradeCard = function(grade) {
    if ($scope.currentCard) {
      $scope.currentCard.grade = grade;
      $scope.currentCard.graded = true;
      $scope.set.gradedCount++;
    }
  };

  $scope.nextCard = function() {
    // find index of current card in current color
    var index = $scope.cardsByColor[$scope.currentColor].indexOf($scope.currentCard);
    // if there's a card in the next spot, make that the current card
    var nextCard = $scope.cardsByColor[$scope.currentColor][index + 1];
    if (typeof(nextCard) != 'undefined') {
      $scope.setCard($scope.currentColor, nextCard);
    }
    // else go to next color, first card there
    else {
      var nextColor = $scope.colors[$scope.colors.indexOf($scope.currentColor) + 1];
      // if we're on the last color, then the next one is undefined, so we'll start over at White
      if (typeof(nextColor) == 'undefined') {
        $scope.setCard('White', $scope.cardsByColor.White[0]);
      }
      else {
        $scope.setCard(nextColor, $scope.cardsByColor[nextColor][0]);
      }
    }

    resetCardLocation();
  };

  $scope.prevCard = function() {
    // find index of current card in current color
    var index = $scope.cardsByColor[$scope.currentColor].indexOf($scope.currentCard);
    // if there's a card in the previous spot, make that the current card
    var prevCard = $scope.cardsByColor[$scope.currentColor][index - 1];
    if (typeof(prevCard) != 'undefined') {
      $scope.setCard($scope.currentColor, prevCard);
    }
    // else go to prev color, last card there
    else {
      var prevColor = $scope.colors[$scope.colors.indexOf($scope.currentColor) - 1];
      // if we're on the first color, then the previous one is undefined, so we'll go to end (land)
      if (typeof(prevColor) == 'undefined') {
        $scope.setCard('Land', $scope.cardsByColor.Land[$scope.cardsByColor.Land.length - 1]);
      }
      else {
        $scope.setCard(prevColor, $scope.cardsByColor[prevColor][$scope.cardsByColor[prevColor].length -1]);
      }
    }
    resetCardLocation();
  };

  var resetCardLocation = function() {
    var image = document.getElementById('currentCard');
    // Set at default location if not yet graded
    if (typeof($scope.currentCard.graded) == 'undefined') {
      var defaultGradeLocation = document.getElementById('gradeC');
      defaultGradeLocation.appendChild(image);
    }
    // Otherwise set where the grade is
    else {
      var currentGradeLocation = document.getElementById('grade' + $scope.currentCard.grade);
      currentGradeLocation.appendChild(image);
    }
  };

});
