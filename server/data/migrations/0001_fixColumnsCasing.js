const db = require('../../lib/db');

async function sequenceRenames (data) {
  try {
    for (let i = 0; i < data.length; i++) {
      const [ table, oldColumn, newColumn ] = data[i];
      await db.query(
        `ALTER TABLE ${table} RENAME COLUMN ${oldColumn} TO ${newColumn}`
      );
    }
  }
  catch (e) {
    return Promise.reject(e);
  }
}

function migrate () {
  return sequenceRenames([
    [ 'rows', 'videoId', 'video_id' ],
    [ 'rows', 'createdBy', 'created_by' ],
    [ 'rows', 'modifiedLastBy', 'modified_last_by' ],
    [ 'likes', 'videoId', 'video_id' ],
    [ 'likes', 'userId', 'user_id' ],
    [ 'likes', 'rowId', 'row_id' ],
    [ 'comments', 'videoId', 'video_id' ],
    [ 'comments', 'userId', 'user_id' ],
    [ 'comments', 'rowId', 'row_id' ],
  ]);
}

function rollback () {
  return sequenceRenames([
    [ 'rows', 'video_id', 'videoId' ],
    [ 'rows', 'created_by', 'createdBy' ],
    [ 'rows', 'modified_last_by', 'modifiedLastBy' ],
    [ 'likes', 'video_id', 'videoId' ],
    [ 'likes', 'user_id', 'userId' ],
    [ 'likes', 'row_id', 'rowId' ],
    [ 'comments', 'video_id', 'videoId' ],
    [ 'comments', 'user_id', 'userId' ],
    [ 'comments', 'row_id', 'rowId' ],
  ]);
}

module.exports = { migrate, rollback };
