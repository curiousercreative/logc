const { curry, exists } = require('functional.js');
const fromEntries = require('./fromEntries.js');

/**
 * curried replacement for lodash.omit (not the same signature though)
 * @param  {string|array} key - what to copy from source obj
 * @param  {object} src - source object to pick values from
 * @return {object}
 */
module.exports = curry(function omit (keys, src) {
  if (Array.isArray(keys) && exists(keys)) keys = [ keys ];

  return fromEntries(
    Object
      .entries(src)
      // filter out blacklisted keys
      .filter(([ key ]) => !keys.includes(key))
  );
});
