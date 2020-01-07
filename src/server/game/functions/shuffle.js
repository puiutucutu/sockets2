/**
 * @param {Array} xs
 * @return {Array}
 */
function shuffle(xs) {
  let counter = xs.length;
  while (counter > 0) {
    // while there are elements in the array
    let index = Math.floor(Math.random() * counter); // pick a random index
    counter--; // decrease counter by 1

    // swap the last element with it
    let temp = xs[counter];
    xs[counter] = xs[index];
    xs[index] = temp;
  }

  return xs;
}

export { shuffle };
