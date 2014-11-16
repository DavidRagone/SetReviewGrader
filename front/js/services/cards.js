/**
 * cardsService
 *
 * Manages card & set info, including fetching data from server & storing locally
 *   A card object looks like: 
 *   {
 *     "layout":"normal",
 *     "type":"Creature â€” Spirit",
 *     "types":["Creature"],
 *     "colors":["Black"],
 *     "multiverseid":383175,
 *     "name":"Accursed Spirit",
 *     "subtypes":["Spirit"],
 *     "cmc":4,
 *     "rarity":"Common",
 *     "artist":"Kev Walker",
 *     "power":"3",
 *     "toughness":"2",
 *     "manaCost":"{3}{B}",
 *     "text":"Intimidate (This creature can't be blocked except by artifact creatures and/or creatures that share a color with it.)",
 *     "flavor":"Many have heard the slither of dragging armor and the soft squelch of its voice. But only its victims ever meet its icy gaze.",
 *     "number":"85",
 *     "imageName":"accursed spirit"
 *   }
 *
 */
setReviewGrader.factory('cardsService', function ($http, $localStorage, $q) {
  var data, sortedCards, set;

  return {
    /**
     * Gets card & set data from localStorage or mtgjson.com. Returns the data
     *   in the form of a promise, which, when resolved, will contain keys for
     *   the cards & set.
     *
     * @method fetchData
     * @param {String} : setCode - the three-letter representation of the magic set
     * @return {Promise}
     */
    fetchData: function(setCode) {
      var deferred = $q.defer();
      // not yet in memory
      if (typeof(data) === "undefined") {
        // not stored in local storage, fetch from url
        if (!dataStoredLocally(setCode)) {
          // TODO - move url base to constant
          $http.get("http://mtgjson.com/json/" + setCode + ".json")
            .success(function(response) {
              sortedCards = sortCards(response.data.cards);
              set = {
                name: response.name,
                code: response.code,
                cardCount: sortedCards.length;
                gradedCount: 0
              };
              storeLocally(set, sortedCards);
              deferred.resolve({
                sortedCards: sortedCards,
                set: set
              })
            }).error(function(msg, code) {
              deferred.reject(msg);
              console.log(msg, code);
            });
        // load from local storage
        } else {
          data = loadFromLocalStorage(setCode);
          sortedCards = data.sortedCards;
          set = data.set;
          deferred.resolve({
            sortedCards: sortedCards,
            set: set
          });
        }
      // in memory, load from there
      } else {
        deferred.resolve({
          sortedCards: sortedCards,
          set: set
        });
      }
      return deferred.promise;
    },

    /**
     * Whether or not the given set's data is already in localStorage
     *
     * @method dataStoredLocally
     * @param {String} set - the three-letter representation of the magic set
     * @return {Boolean}
     */
    dataStoredLocally: function(set) {
      return typeof($localStorage.setReviewGraderData) !== "undefined" &&
        typeof($localStorage.setReviewGrader[set]) !== "undefined";
    },

    /**
     * Loads the current set & set's cards from localStorage
     *
     * @method loadFromLocalStorage
     * @param {String} setCode - the three-letter representation of the magic set
     * @return {Object} - { set: {//set data}, cards: {//card data} }
     */
    loadFromLocalStorage: function(setCode) {
      return {
        set: $localStorage.setReviewGrader[setCode].set,
        sortedCards: sortCards($localStorage.setReviewGrader[setCode].sortedCards)
      };
    },

    /**
     * Stores data in local storage
     *
     * @method storeLocally
     * @param {Object} : set
     * @param {Object} : sortedCards
     */
    storeLocally: function(set, sortedCards) {
      if (typeof($localStorage.setReviewGrader) === "undefined") {
        $localStorage.setReviewGrader = {};
      }
      $localStorage.setReviewGrader[set.code] = { set: set, sortedCards: sortedCards }; 
    },

    /**
     * Sorts cards by color, then alphabetically
     *
     * @method sortcards
     * @param {Array} cards
     * @return {Array} sorted cards
     */
    sortCards: function(cards) {
      var colorOrder = {
        'White':        0,
        'Blue':         1,
        'Black':        2,
        'Red':          3,
        'Green':        4,
        'Multicolored': 5,
        'Artifact':     6,
        'Land':         7
      };

      var sortByColor = function(a,b) {
        if (colorOrder[colorOf(a)] > colorOrder[colorOf(b)]) {
          return 1;
        } else if (colorOrder[colorOf(a)] < colorOrder[colorOf(b)]) {
          return -1;
        } else {
          return 0;
        }
      };

      var sortByName = function(a,b) {
        if (a > b) { return 1; }
        if (a < b) { return -1; }
        return 0;
      };

      return cards.sort(function(a,b) {
        var byColor = sortByColor(a,b);
        if (byColor === 0) {
          return sortByName(a,b);
        } else {
          return byColor;
        }
      });
    },

    /**
     * Returns the color of the card, handling multicolored or no color
     *
     * @method colorOf
     * @param {Object} : card
     * @return {String} : e.g., "White", "Artifact", "Land", or "Multicolored"
     */
    colorOf: function(card) {
      if (typeof(card.colors) == 'undefined' && card.type.match(/Land/)) {
        return "Land";
      }
      else if (typeof(card.colors) == 'undefined' && card.type.match(/Artifact/)) {
        return "Artifact";
      }
      else if (card.colors.length > 1) {
        return "Multicolored";
      }
      else {
        return card.colors[0];
      }
    },
  };
});
