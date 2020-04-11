/**
 * fromEntries - Object.fromEntries
 * @param  {Array}  [entries=[]]
 * @return {object}
 */
module.exports = function fromEntries (entries = []) {
  return (typeof Object.fromEntries === 'function')
    ? Object.fromEntries
    : entries.reduce((obj, entry) => ({
      ...obj,
      [entry[0]]: entry[1],
    }), {});
}
