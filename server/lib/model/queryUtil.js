const { curry, exists } = require('functional.js');
const zip = require('../../../shared/util/zip.js');

/**
 * @param  {array} fields
 * @param  {string} targetNamespace
 * @return {string}
 */
function getColumnsForUpdate (fields, targetNamespace) {
  return fields.map(f => `${f} = ${targetNamespace}.${f}`);
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
 * @param  {array} list
 * @return {string}
 */
function stringifyFields (list) {
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
  getValues,
  stringifyFields,
  stringifyValues,
}
