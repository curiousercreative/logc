/**
 * zipObject - merge two arrays into an object
 * @param  {array} ...lists - two or more lists to zip
 * @return {array[]} if lists are not the same length, entries will be limited
 * by the first list length
 */
module.exports = function zip (...lists) {
  let entries = [];

  for (let i = 0; i < lists[0].length; i++) {
    entries.push(lists.map(l => l[i]));
  }

  return entries;
}
