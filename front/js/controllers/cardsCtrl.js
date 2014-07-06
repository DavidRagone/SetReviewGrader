setReviewGrader.controller('cardsCtrl', function ($scope, $http) {
  // Get set & card json
  $http({
    url: "http://mtgjson.com/json/JOU.json",
    method: "GET"
  }).success(function(data, status, headers, config) {
    $scope.set = {
      cardCount: data.cards.length,
      gradedCount: 0,
      name: data.name,
      percentGraded: function() {
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        // Shift
        var value = (this.gradedCount / this.cardCount) * 100
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 1) : 1)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - 1) : -1)) + "%";
      }
    };
    $scope.allCards = data.cards;
    $scope.cardsByColor = {
      White: [],
      Blue: [],
      Black: [],
      Red: [],
      Green: [],
      Multicolored: [],
      Artifact: [],
      Land: [],
    };
    $scope.colors = Object.keys($scope.cardsByColor);
    var card;
    for (var i = 0; i < $scope.allCards.length; i++) {
      card = $scope.allCards[i];
      if (typeof(card.colors) == 'undefined' && card.type === 'Land') {
        $scope.cardsByColor.Land.push(card);
      }
      else if (typeof(card.colors) == 'undefined' && card.type.match(/Artifact/)) {
        $scope.cardsByColor.Artifact.push(card);
      }
      else if (card.colors.length > 1) {
        $scope.cardsByColor.Multicolored.push(card);
      }
      else {
        $scope.cardsByColor[card.colors[0]].push(card);
      }
    }

    $scope.setCard('White', $scope.cardsByColor.White[0]);
  }).error(function(data, status, headers, config) {
    console.log(data);
  });
  // END Get set & card json

  // Update current card's grade on drag-and-drop
  $scope.updateGrade = function(grade) {
    $scope.currentCard.grade = grade;
  }

  $scope.setCard = function(color, card) {
    // If previous card has not been graded:
    //   set grade, mark as graded, inc count
    if ($scope.currentCard && !$scope.currentCard.graded) {
      $scope.currentCard.graded = true;
      $scope.set.gradedCount++;
    }
    $scope.currentColor = color;
    $scope.currentCard = card;
    $scope.currentCard.grade = 'C';
  }

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
  }

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
  }
});
