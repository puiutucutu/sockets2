class Card {
  rank;
  suit;

  /**
   * @param {CardRank} rank
   * @param {Suit} suit
   */
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getRank() {
    return this.rank;
  }

  getSuit() {
    return this.suit;
  }
}

export { Card };
