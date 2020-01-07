/**
 * SERVER SIDE
 */

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

const randomIntFromInterval = min => max => Math.floor(Math.random() * (max - min + 1) + min); // prettier-ignore

const PLAYER_READY = "PLAYER_READY";
const LEGAL_GAME_MOVES_FOR_HAND = "LEGAL_GAME_MOVES_FOR_HAND";
const NO_LEGAL_GAME_MOVES_FOR_HAND = "NO_LEGAL_GAME_MOVES_FOR_HAND";
const PLAYER_REQUEST_DOUBLE = "PLAYER_REQUEST_DOUBLE";
const PLAYER_REQUEST_HIT = "PLAYER_REQUEST_HIT";
const PLAYER_REQUEST_SPLIT = "PLAYER_REQUEST_SPLIT";
const PLAYER_REQUEST_STAND = "PLAYER_REQUEST_STAND";
const PLAYER_HAND_SPLIT = "PLAYER_HAND_SPLIT";
const HAND_SPLIT = "HAND_SPLIT";

const EMITTABLE_EVENTS = {
  PLAYER: {
    PLAYER_READY,
    PLAYER_REQUEST_DOUBLE,
    PLAYER_REQUEST_HIT,
    PLAYER_REQUEST_SPLIT,
    PLAYER_REQUEST_STAND
  },
  HAND: {
    LEGAL_GAME_MOVES_FOR_HAND,
    NO_LEGAL_GAME_MOVES_FOR_HAND,
    HAND_SPLIT
  },

  PLAYER_READY,
  LEGAL_GAME_MOVES_FOR_HAND,
  NO_LEGAL_GAME_MOVES_FOR_HAND,
  PLAYER_REQUEST_DOUBLE,
  PLAYER_REQUEST_HIT,
  PLAYER_REQUEST_SPLIT,
  PLAYER_REQUEST_STAND,
  PLAYER_HAND_SPLIT
};

const GAME_MOVES = {
  DOUBLE: "DOUBLE",
  HIT: "HIT",
  SPLIT: "SPLIT",
  STAND: "STAND"
};

class Player {
  hands;

  /**
   * @param {string} handId
   * @return {Hand}
   */
  getHandById(handId) {
    if (this.hands.hasOwnProperty(handId)) {
      return this.hands[handId];
    } else {
      return [];
    }
  }
}

const Card = {
  rank: "",
  suit: ""
};

const Hand = {
  cards: [],
  config: {
    canOnlyDoubleNineOrTenOrEleven: false
  },
  handType: "initial", // initial | split | double
  handHistoryStack: ["initial", "split", "double"],
  handHistoryStackExample: ["initial", "double"],
  handHistoryStackExampleTwo: ["hit", "hit", "stand"],
  isInitialHand: true,
  isSplitHand: false,
  isSplitHandInitial: false,
  isBlackjack: function() {
    return this.getHandValues().filter(x => x === 21).length > 0; // one or more hands combinations adds up to 21
  },
  isBust: function() {
    return this.getHandValues().filter(x => x <= 21).length === 0; // no possible hand value combination is less than or equal to 21
  },
  isPair: function() {
    return (
      this.cards.length === 2 &&
      this.cards[0].cardRank === this.cards[1].cardRank
    );
  },
  isDoubleable: function() {},
  canSplit: function() {
    return this.isPair();
  },
  addCard: function(card) {
    this.cards.push(card);
  },
  getHandValues: function() {
    return [3, 13]; // i.e., given three aces
  },
  /**
   * @return {[Hand, Hand]}
   */
  splitHand: function() {
    if (!this.isInitialHand) {
      throw new Error("can only split an initial hand");
    }

    if (!this.isPair()) {
      throw new Error("can only split a hand containing a pair");
    }

    if (this.isInitialHand && this.isPair()) {
      const [a, b] = this.cards;
      const handOne = Object.create(Hand);
      const handTwo = Object.create(Hand);

      handOne.addCard(a);
      handTwo.addCard(b);

      handOne.isInitialHand = false;
      handOne.isSplitHand = true;
      handOne.isSplitHandInitial = true;

      handTwo.isInitialHand = false;
      handTwo.isSplitHand = true;
      handTwo.isSplitHandInitial = true;

      return [handOne, handTwo];
    }
  },
  getPossibleLegalMoves: function() {
    const possibleLegalMoves = [];

    if (this.isInitialHand) {
      possibleLegalMoves.push(GAME_MOVES.HIT);
      possibleLegalMoves.push(GAME_MOVES.STAND);
      possibleLegalMoves.push(GAME_MOVES.DOUBLE);

      if (this.isPair()) {
        possibleLegalMoves.push(GAME_MOVES.SPLIT);
      }
    } else {
      if (this.isPair()) {
        if (this.isSplitHand && this.isSplitHandInitial) {
          possibleLegalMoves.push(GAME_MOVES.HIT);
          possibleLegalMoves.push(GAME_MOVES.STAND);
          possibleLegalMoves.push(GAME_MOVES.DOUBLE);
        } else {
          possibleLegalMoves.push(GAME_MOVES.HIT);
          possibleLegalMoves.push(GAME_MOVES.STAND);
          possibleLegalMoves.push(GAME_MOVES.DOUBLE);
        }
      } else {
        possibleLegalMoves.push(GAME_MOVES.HIT);
        possibleLegalMoves.push(GAME_MOVES.STAND);
        possibleLegalMoves.push(GAME_MOVES.DOUBLE);
      }
    }

    if (this.isInitialHand && this.isPair()) {
      possibleLegalMoves.push([GAME_MOVES.SPLIT]);
    }

    if (
      (this.isPair() && this.isInitialHand) ||
      (this.isPair() && this.isSplitHand && this.isSplitHandInitial)
    ) {
      return [GAME_MOVES.HIT, GAME_MOVES.STAND, GAME_MOVES.SPLIT];
    }

    return possibleLegalMoves;

    if (
      (this.isPair() && this.isInitialHand) ||
      (this.isPair() && this.isSplitHand && this.isSplitHandInitial)
    ) {
      return [GAME_MOVES.HIT, GAME_MOVES.STAND, GAME_MOVES.SPLIT];
    }

    if (this.isInitialHand) {
      return [GAME_MOVES.HIT, GAME_MOVES.STAND, GAME_MOVES.DOUBLE];
    }

    return [GAME_MOVES.HIT, GAME_MOVES.STAND];
  }
};

const GameKernel = {
  gameState: {
    players: [],
    currentPlayerTurn: "playerIdGoesHere"
  },
  drawCard: function() {
    const cards = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]; // prettier-ignore
    const i = randomIntFromInterval(0, cards.length - 1);
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

const gameKernel = Object.create(GameKernel);

socket.on(EMITTABLE_EVENTS.PLAYER_REQUEST_HIT, function(data) {
  const { playerId, handId } = data;
  const card = gameKernel.drawCard();
  gameKernel.addCardToPlayerHand(playerId, handId, card); // update local game state
  gameKernel.checkPlayerHand(playerId, handId); // perform checks with player's updated hand
  const legalGameMoves = getPossibleActionsForHand(playerId);

  if (legalGameMoves.length) {
    socket.emit(EMITTABLE_EVENTS.LEGAL_GAME_MOVES_FOR_HAND, { playerId, handId, legalGameMoves }); // prettier-ignore
  } else {
    socket.emit(EMITTABLE_EVENTS.NO_LEGAL_GAME_MOVES_FOR_HAND, { playerId, handId }); // prettier-ignore
  }
});

socket.on(EMITTABLE_EVENTS.PLAYER_REQUEST_SPLIT, function(data) {
  const { playerId, handId } = data;

  const player = gameKernel.getPlayerById(playerId);
  const hand = player.getHandById(handId);
  const [handOne, handTwo] = hand.splitHand();
  player.hands = [handOne, handTwo];

  socket.emit(EMITTABLE_EVENTS.HAND.HAND_SPLIT, { playerId, hands });
});

/**
 * CLIENT SIDE
 */

socket.emit(EMITTABLE_EVENTS.PLAYER_REQUEST_HIT, {
  playerId: "bc1cd8e4-fb2a-4e34-9d28-bfa58d501f61",
  handId: "99cc6959-e4cd-4d6f-8c55-2550613ce98c"
});

// prettier-ignore
socket.on(EMITTABLE_EVENTS.LEGAL_GAME_MOVES_FOR_HAND, function(message) {
  const { playerId, handId, legalGameMoves} = message;
});
