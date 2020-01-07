const randomIntFromInterval = function(min) {
  return function(max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
};

const kernel = {
  gameState: {
    players: [],
    currentPlayerTurn: "playerIdGoesHere"
  },
  drawCard: function() {
    const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] // prettier-ignore
    const i = randomIntFromInterval(0)(cards.length - 1);
    return cards[i];
  },
  /**
   * @param {string} playerId
   * @return {Player}
   */
  getPlayerById: function(playerId) {
    return this.gameState.players.filter(player => player.getId() === playerId);
  },
  addCardToPlayerHand: function(playerId, handId, card) {
    const player = this.getPlayerById(playerId);
    const hand = player.getHand(handId);
    hand.addCard(card);
  },
  getPossibleActionsForHand: function(playerId) {
    const player = this.getPlayerById(playerId);
    const hand = player.getHand();

    if (hand.isBlackjack() || hand.isBust()) {
      return [];
    }

    if (hand.isPair()) {
      return [GAME_MOVES.HIT, GAME_MOVES.STAND, GAME_MOVES.SPLIT];
    }

    return [GAME_MOVES.HIT, GAME_MOVES.STAND];
  },
  checkPlayerHand: function(playerId) {
    const player = this.getPlayerById(playerId);
    const hand = player.getHand();

    if (hand.isBlackjack()) {
    }

    if (hand.isBust()) {
    }
  }
};

export { kernel };
