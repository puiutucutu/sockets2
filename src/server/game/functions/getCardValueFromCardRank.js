import { cardRanks } from "../../shared/types";

/**
 * @param {CardRank} cardRank
 * @return {number}
 */
function getCardValueFromCardRank(cardRank) {
  const cardRankToValueDict = {
    [cardRanks.ACE]: [1, 11],
    [cardRanks.TWO]: [2],
    [cardRanks.THREE]: [3],
    [cardRanks.FOUR]: [4],
    [cardRanks.FIVE]: [5],
    [cardRanks.SIX]: [6],
    [cardRanks.SEVEN]: [7],
    [cardRanks.EIGHT]: [8],
    [cardRanks.NINE]: [9],
    [cardRanks.TEN]: [10],
    [cardRanks.JACK]: [10],
    [cardRanks.QUEEN]: [10],
    [cardRanks.KING]: [10]
  };

  return cardRankToValueDict[cardRank];
}

export { getCardValueFromCardRank };
