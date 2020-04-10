const { curry, exists, isObject } = require('functional.js');

const apiCache = require('../apiCache.js');
const db = require('../db.js');
const tap = require('../../../shared/util/tap.js');
const {
  getColumnsForUpdate,
  getValues,
  stringifyFields,
  stringifyValues,
} = require('./queryUtil.js');

class Model {
  static cacheKeyPrefix = 'api.cache';

  // override these properties
  static cacheKey; // used for Redis cache
  static cacheRoutePatterns; // list of HTTP cache patterns
  // used for simplistic query generation
  static dbFields = [];
  static dbFrom;
  static dbPrimaryKey = 'id';
  static dbOrderBy;

  /**
   * @param  {string} [id] supplied if getting single item resource
   * @return {promise} resolves with (object|object[]|null)
   */
  static cacheGet (id) {
    return apiCache.getObject(this.getCacheKey(id));
  }

  /**
   * @type {function}
   * @param {string} [id]
   * @param {object|object[]}
   * @return {promise}
   */
  static cacheSet (id, val) {
    return apiCache.setObject(this.getCacheKey(id), val);
  }

  /**
   * @param  {object[]}  collection
   * @param  {object}  [relations={}]
   * @param  {boolean} [useCache=true]
   * @return {promise} resolving with
   */
  static create (collection, relations = {}, useCache = true) {
    let isSingleRow;
    if (!isObject(collection) && Array.isArray(collection)) {
      throw new Error('unexpected value for "collection". expecting object or collection');
    }

    // normalize to collection
    if (!Array.isArray(collection)) {
      isSingleRow = true;
      collection = [ collection ];
    }

    // filter out primary key from fields
    const dbFields = this.dbFields.filter(([ key ]) => key !== this.dbPrimaryKey);
    const fields = dbFields.map(([ key ]) => key);
    const values = collection
      .map(item => getValues(dbFields, item))
      .map(values => stringifyValues(dbFields, values));
    let query = `
      INSERT INTO ${this.dbFrom} ${stringifyFields(fields)}
        VALUES ${values.join(', ')}
        RETURNING ${this.dbFields.map(([ key ]) => key).join(', ')}`;

    return db
      .query(query)
      .then(res => isSingleRow ? res.rows[0] : res.rows);
  }

  /**
   * @param  {string} [id]
   * @return {promise}
   */
  static expireCache (id) {
    let expirations = [];

    // add collection expiration
    if (this.cacheKey) expirations.push(apiCache.expireObject(this.getCacheKey()));
    // add item expiration
    if (this.cacheKey && exists(id)) expirations.push(apiCache.expireObject(this.getCacheKey(id)));
    // add any HTTP cache expiration requests
    if (this.cacheRoutes.length) expiractions.push(...apiCache.expireHttp(this.cacheRoutes));

    return expirations.length ? Promise.all(expirations) : Promise.resolve();
  }

  /**
   * @param  {string} [id]
   * @return {promise} resolves with requested resource(s)
   */
  static fetch (id) {
    let query = `SELECT * FROM ${this.dbFrom}`;

    if (exists(id)) query += ` WHERE id = ${id}`;
    if (exists(this.dbOrderBy)) query += ` ORDER BY ${this.dbOrderBy}`;

    return db
      .query(query)
      .then(res => exists(id) ? res.rows[0] : res.rows);
  }

  /**
   * @param  {object}  urlParams
   * @param  {boolean} [useCache=true]
   * @return {promise} resolves with requested resource(s)
   */
  static get (urlParams, useCache = true) {
    const id = this.id(urlParams);

    if (!useCache) return this.fetch(id);

    return this.cacheGet(id).then(cachedVal => exists(cachedVal)
        // found cached value
        ? cachedVal
        // fetch and write to cache without waiting for response
        : this.fetch(id).then(tap(val => this.cacheSet(id, val)))
      );
  }

  /**
   * @param  {string} [id]
   * @return {string}
   */
  static getCacheKey (id) {
    let namespaces = [ this.cacheKeyPrefix, this.cacheKey ];

    if (exists(id)) namespaces.push(id);

    return namespaces.join('.');
  }

  /**
   * @param  {object} params
   * @return {string|number}
   */
  static id (params) {
    return params[this.dbPrimaryKey];
  }

  /**
   * @param  {string} [id]
   * @return {array]}
   */
  static parseCacheRoutes (id) {
    const regex = new RegExp(`(:${this.dbPrimaryKey})`, 'g');

    return exists(id)
      // substitute our resource id into any patterns that require
      ? this.cacheRoutePatterns.map(pattern => pattern.replace(regex, id))
      // if we don't have an id, remove any patterns that require an id
      : this.cacheRoutePatterns.filter(p => !p.match(regex));
  }

  /**
   * @param  {object[]}  collection
   * @param  {object} [relations={}]
   * @param  {Boolean} [useCache=true]
   * @return {promise}
   */
  static update (collection, relations = {}, useCache = true) {
    let isSingleRow;
    if (!isObject(collection) && Array.isArray(collection)) {
      throw new Error('unexpected value for "collection". expecting object or collection');
    }

    // normalize to collection
    if (!Array.isArray(collection)) {
      isSingleRow = true;
      collection = [ collection ];
    }

    const fields = this.dbFields.map(([ key ]) => key);
    const columns = getColumnsForUpdate(fields.filter(f => f !== this.dbPrimaryKey), 'b');
    const values = collection
      .map(item => getValues(this.dbFields, item))
      .map(values => stringifyValues(this.dbFields, values));

    let query =
      `UPDATE ${this.dbFrom}
        AS a SET ${columns.join(', ')}
      FROM (VALUES ${values.join(', ')})
        AS b(${fields.join(', ')})
      WHERE b.id = a.id
      RETURNING ${fields.map(f => `b.${f}`).join(', ')}`;

    return db
      .query(query)
      .then(tap(console.log))
      .then(res => isSingleRow ? res.rows[0] : res.rows);
      // TODO: update cache
  }
}

module.exports = Model;
