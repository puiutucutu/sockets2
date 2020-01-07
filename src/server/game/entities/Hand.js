class Hand {
  /**
   * @type {number}
   */
  bet;

  /**
   * @type {Card[]}
   */
  cards;

  /**
   * @param {number} bet
   */
  constructor(bet) {
    this.bet = bet;
  }

  /**
   * @return {number}
   */
  getBet() {
    return this.bet;
  }

  /**
   * @return {Card[]}
   */
  getCards() {
    return this.cards;
  }
}

export { Hand };
