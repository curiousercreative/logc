/**
 * zipObject - merge two arrays into an object
 * @param  {array} keys
 * @param  {array} values
 * @return {object} if keys and values are not the same length, object will be limited
 * by the values list length
 */
module.exports = function zipObject (keys, values) {
  return values.reduce((obj, val, i) => ({
    ...obj,
    [keys[i]]: val,
  }), {});
}
