/**
 * @param {array} xs
 * @return {array}
 * @see https://stackoverflow.com/a/4331218
 * @example
 *
 * cartesianProduct([["1", "11"], ["1", "11"], ["10"]]); //=> [[1,1,10],[1,11,10],[11,1,10],[11,11,10]]
 *
 */
function cartesianProduct(xs) {
  return xs.reduce(function(a, b) {
    return a.reduce(function(r, v) {
      return r.concat(
        b.map(function(w) {
          return [].concat(v, w);
        })
      );
    }, []);
  });
}

export { cartesianProduct };
