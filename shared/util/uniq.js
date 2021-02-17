const { nub } = require('functional.js');

/**
 * replacement for lodash.uniq
 * @param  {array} items
 * @return {array} dedpulicated input array
 */
module.exports = function uniq (items) {
  return nub((a, b) => a === b, items);
}
