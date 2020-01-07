import { cardRanks, suits } from "../../shared/types";
import { Card } from "../../shared/Card";

/**
 * @return {Card[][]}
 */
function makeDeck() {
  return Object.keys(cardRanks).flatMap(function(cardRank) {
    return Object.keys(suits).map(function(suit) {
      return new Card(cardRank, suit);
    });
  });
}

export { makeDeck };
