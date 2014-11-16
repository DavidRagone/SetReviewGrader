/**
 * cardCtrl - TODO: rename
 *
 * Main controller for set review grading
 */
setReviewGrader.controller('cardsCtrl', function ($scope, $localStorage, cardsService) {
  /**
   * sets: Manually maintained list of magic the gathering sets.
   *   Ordered chronologically descending.
   */
  $scope.sets = [
    'KTK',
    'M15',
    'JOU', 'BNG', 'THS',
    'M14',
  ];

  /**
   * currentSet: The set the user is grading. Defaults to the most recent
   */
  $scope.currentSet = $scope.sets[0];

  /**
   * cardFilters: Filters applied to set's cards (e.g., show me only 'White' cards)
   */
  $scope.cardFilters = {
    // TODO - add more
    colors: {}
  };

  /**
   * Initialize the card & set data (via cardsService)
   */
  cardsService.fetchData($scope.currentSet).then(function(data) {
    $scope.cards = data.cards;
    $scope.set   = data.set;
    $scope.currentCard  = data.sortedCards[0];
  });

  /**
   * Calculates integer percentage of current set that has been graded
   *
   * @method percentGraded
   * @return {Number} : percent graded, e.g. 45. Always returns an integer
   */
  $scope.percentGraded = function() {
    if ($scope.set) {
      return cardsService.percentGraded($scope.set.code);
    }
  };

  /**
   * Handles grading the current card (including incrementing count of cards graded)
   *
   * @method gradeCard
   * @param {String} : grade, e.g. 'C'
   */
  $scope.gradeCard = function(grade) {
    if ($scope.currentCard) {
      $scope.currentCard.grade = grade;
      // increment count if not previously graded
      if (typeof($scope.currentCard.graded) == 'undefined') {
        $scope.set.gradedCount++;
        $scope.currentCard.graded = true;
      }
      // Store locally
      cardsService.storeLocally($scope.set, $scope.cards);
    }
  };

  /**
   * Sets currentCard to the next card in the list of sorted cards
   *
   * @method nextCard
   */
  $scope.nextCard = function() {
    // TODO - respect filters
    $scope.currentCard = $scope.cards[$scope.cards.indexOf($scope.currentCard) + 1];
  };

  /**
   * Sets currentCard to the previous card in the list of sorted cards
   *
   * @method prevCard
   */
  $scope.prevCard = function() {
    // TODO - respect filters
    $scope.currentCard = $scope.cards[$scope.cards.indexOf($scope.currentCard) - 1];
  };
});
