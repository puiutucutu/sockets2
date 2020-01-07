import { shuffle } from "./shuffle";
import { makeDeck } from "./makeDeck";

/**
 * @param {number} numberOfDecks
 * @return {Card[]}
 */
function makeShoe(numberOfDecks) {
  if (!numberOfDecks) {
    throw new Error("missing `numberOfDecks`");
  }

  const deck = makeDeck();
  const shoe = [];
  for (let i = 0; i < numberOfDecks; i++) {
    shoe.push(...deck);
  }

  return shuffle(shoe);
}

export { makeShoe };
