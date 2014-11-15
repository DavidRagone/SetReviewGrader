setReviewGrader.filter('cardFilter', function () {
  return function (cards, cardFilter) {
    return cards.filter(function (card) {
      var matches = true;

      Object.keys(cardFilter.colors).forEach(function (color) {
        if (cardFilter.colors[color]) {
          debugger
          matches = matches && card.colors && card.colors.indexOf(color) !== -1;
        }
      });

      return matches;
    });
  };
});