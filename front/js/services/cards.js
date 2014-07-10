setReviewGrader.service('cardsService', function ($http) {
  this.fetchData = function(callback) {
    // Return a promise that has response data
    return $http.get("http://mtgjson.com/json/M15.json")
      .then(function(response) { return response.data; });
  };

  this.set = function(data) {
    return {
      cardCount: data.cards.length,
      gradedCount: 0,
      name: data.name
    };
  };

  this.initializeCardsByColor = function() {
    return {
      White: [],
      Blue: [],
      Black: [],
      Red: [],
      Green: [],
      Multicolored: [],
      Artifact: [],
      Land: [],
    };
  };

  this.groupCardsByColor = function(cardsByColor, allCards) {
    var card;

    for (var i = 0; i < allCards.length; i++) {
      card = allCards[i];
      if (typeof(card.colors) == 'undefined' && card.type.match(/Land/)) {
        cardsByColor.Land.push(card);
      }
      else if (typeof(card.colors) == 'undefined' && card.type.match(/Artifact/)) {
        cardsByColor.Artifact.push(card);
      }
      else if (card.colors.length > 1) {
        cardsByColor.Multicolored.push(card);
      }
      else {
        cardsByColor[card.colors[0]].push(card);
      }
    }
  };
});

