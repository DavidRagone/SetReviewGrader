setReviewGrader.controller('cardsCtrl',
  function ($scope, $localStorage, cardsService) {

    $scope.setCard = function(color, card) {
      // Before we move to the next card:
      //   If previous card has not been graded, make grade the default 'C'
      if (typeof($scope.currentCard) != 'undefined' && typeof($scope.currentCard.graded) == 'undefined') {
        $scope.gradeCard('C');
      }
      $scope.currentColor = color;
      $scope.currentCard = card;
      // Now that we're on the new card:
      //   If you hadn't graded it previously, set it to 'C' (manually, w/o incrementing, etc.)
      if (typeof($scope.currentCard.grade) == 'undefined') {
        $scope.currentCard.grade = 'C';
      }
      if (typeof(resetCardLocation) != 'undefined') { resetCardLocation(); }
    };

    // https://github.com/gsklee/ngStorage
    $scope.$storage = $localStorage;

    if ($scope.$storage.setReviewGrader) {
      console.log('LOADING FROM LOCAL STORAGE');
      // data stored in local storage as single key with large object... bad idea?
      var data = $scope.$storage.setReviewGrader;
      $scope.set = data.set;
      $scope.cardsByColor = data.cardsByColor;
      $scope.colors = data.colors;
      $scope.setCard('White', $scope.cardsByColor.White[0]);
      //TODO - figure out how to get the card to be displayed in the correct location
      //resetCardLocation();
    }
    else {
      $scope.cardsByColor = cardsService.initializeCardsByColor();
      $scope.colors = Object.keys($scope.cardsByColor);

      cardsService.fetchData().then(function(data) {
        $scope.set = cardsService.set(data);
        cardsService.groupCardsByColor($scope.cardsByColor, data.cards);
        $scope.setCard('White', $scope.cardsByColor.White[0]);
      });
    }

    $scope.percentGraded = function() {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
      // Shift
      if ((typeof($scope.set) != 'undefined') && typeof($scope.set.gradedCount) != 'undefined') {
        var value = ($scope.set.gradedCount / $scope.set.cardCount) * 100
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 1) : 1)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - 1) : -1)) + "%";
      }
      else {
        return '0%';
      }
    };

    $scope.gradeCard = function(grade) {
      if ($scope.currentCard) {
        // Grade card
        $scope.currentCard.grade = grade;
        // increment count if not previously graded
        if (typeof($scope.currentCard.graded) == 'undefined') {
          $scope.set.gradedCount++;
          $scope.currentCard.graded = true;
        }

        // Move card
        resetCardLocation();

        // Save everything to local storage
        var localStorageObject = {
          set: $scope.set,
          cardsByColor: $scope.cardsByColor,
          colors: $scope.colors
        };
        $scope.$storage.setReviewGrader = localStorageObject;
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
