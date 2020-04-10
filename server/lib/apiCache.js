const { exists } = require('functional.js');
const fetch = require('unfetch');
const { promisify } = require('util');

const redis = require('./redis.js');
const VARNISH_BASE_URL = 'http://localhost';

// TODO: consider some form of connection optimization for Varnish purging
function expireHttp (paths) {
  if (!Array.isArray(paths) || !paths.length) return Promise.resolve();

  return Promise.all(
    paths.map(path => fetch(`${VARNISH_BASE_URL}${path}`, 'PURGE')),
  );
}

// Object caching
const expireObject = promisify(redis.client.unlink).bind(redis.client);
const get = promisify(redis.client.get).bind(redis.client);
const set = promisify(redis.client.set).bind(redis.client);

/**
 * @param  {string} key
 * @param  {(object|object[])} [defaultValue]
 * @return {Promise} resolves to (object|object[]|null)
 */
function getObject (key, defaultValue) {
  return get(key).then(val => {
    if (exists(val)) return JSON.parse(val);

    return exists(defaultValue)
      ? defaultValue
      : null;
  });
}

/**
 * @param  {string} key
 * @param  {(object|object[])} val
 * @return {Promise}
 */
function setObject (key, val) {
  return set(key, JSON.stringify(val));
}

module.exports = {
  expireHttp,
  expireObject,
  getObject,
  setObject,
};
