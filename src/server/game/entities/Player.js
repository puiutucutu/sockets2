import { Participant } from "./Participant";

class Player extends Participant {
  /**
   * @type {number}
   */
  capital;

  /**
   * @type {number}
   */
  currentBet;

  /**
   * @param {string} id
   * @param {string} name
   * @param {number} capital
   */
  constructor(id, name, capital) {
    super(id, name);
    this.capital = capital;
  }

  addCapital(x) {
    this.capital = this.capital + x;
  }

  withdrawCapital(x) {
    this.capital = this.capital - x;
  }
}

export { Player };
