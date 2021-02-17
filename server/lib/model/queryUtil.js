const { curry, exists } = require('functional.js');
const zip = require('../../../shared/util/zip.js');

/**
 * @param  {array[]} fields
 * @param  {string} targetNamespace
 * @return {string}
 */
function getColumnsForUpdate (fields, targetNamespace) {
  return fields.map(([ f ]) => `${f} = ${targetNamespace}.${f}`);
}

/**
 * @param  {array[]} fields
 * @param  {object]} params
 * @return {string}
 */
function getSelectWhere (fields, params) {
  if (!Object.keys(params).length) return '';

  const wheres = Object
    .entries(params)
    .map(([ key, val ]) => {
      const [ , formatter ] = fields.find(f => f[0] === key);

      return `${key} = ${formatter(val)}`;
    });

  return ` WHERE ${wheres.join(', ')}`;
}

/**
 * @param  {array[]} fields - entries
 * @param  {object} item
 * @return {array} of values
 */
function getValues (fields, item) {
  return fields.reduce((values, [ key ]) => ([
    ...values,
    item[key],
  ]), []);
}

/**
 * @param  {array[]} entries
 * @return {string}
 */
function stringifyFields (entries) {
  const list = entries.map(([ key ]) => key);

  return `(${list.join(', ')})`;
}

/**
 * @param  {array[]} fields - [ fieldName, formatter ]
 * @param  {array} values
 * @return {string}
 */
function stringifyValues (fields, values) {
  const items = fields.map(([ key, formatter ], i) => {
    const val = values[i];

    return exists(val) ? formatter(val) : 'DEFAULT';
  });

  return `(${items.join(', ')})`;
}

module.exports = {
  getColumnsForUpdate,
  getSelectWhere,
  getValues,
  stringifyFields,
  stringifyValues,
}
