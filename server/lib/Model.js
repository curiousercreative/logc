const { Client } = require('pg');
const { promisify } = require('util');
const redis = require('./redis.js');

const tap = require('../util/tap.js');

const cacheGet = promisify(redis.client.get).bind(redis.client);
const cacheSet = promisify(redis.client.set).bind(redis.client);

class Model {
  static cacheKeyPrefix = 'api.cache';
  static cacheKey; // used for Redis cache
  static dbSchema; // used for simplistic query generation
  // TODO: figure out storage of environment config
  static dbClient = new Client({
    user: 'user',
    host: 'db',
    database: 'logc',
    password: 'password',
  })

  static init () {
    return this.dbClient.connect();
  }

  static cacheGet (id) {
    return cacheGet(this.getCacheKey(id))
      .then(this.unserialize);
  }

  static cacheSet (value, id) {
    return cacheSet(this.getCacheKey(id), this.serialize(value));
  }

  static fetch (id) {
    let query = `SELECT * FROM ${this.dbSchema}`;

    if (id != null) query += ` WHERE id = ${id}`;

    return this.dbClient
      .query(query)
      .then(res => id != null ? res.rows[0] : res.rows);
  }

  static get (id, useCache = true) {
    if (!useCache) return this.fetch(id);

    return this.cacheGet(this.getCacheKey(id))
      // if not found in cache, fetch
      .then(val => new Promise(resolve => {
        resolve(val != null ? val : this.fetch(id))
      }))
      // write to cache without waiting for response
      .then(tap(val => this.cacheSet(val, id)));
  }

  static getCacheKey (id) {
    let namespaces = [ this.cacheKeyPrefix, this.cacheKey ];

    if (id != null) namespaces.push(id);

    return namespaces.join('.');
  }


  static serialize (object) {
    return JSON.stringify(object);
  }
  static unserialize (json) {
    return JSON.parse(json);
  }
}

(async () => await Model.init())();
module.exports = Model;
