const { dataTypes, Model } = require('../lib/model');

class Row extends Model {
  static cacheKey = 'row';
  static cacheRoutePatterns = [
    '/video/:videoId/rows/',
  ];
  static dbFields = [
    [ 'id', dataTypes.bigint ],
    [ 'type', dataTypes.varchar ],
    [ 'note', dataTypes.varchar ],
    [ 'timecode', dataTypes.float ],
    [ 'created', dataTypes.bigint ],
    [ 'modified', dataTypes.bigint ],
    [ 'video_id', dataTypes.bigint ],
    [ 'created_by', dataTypes.bigint ],
    [ 'modified_last_by', dataTypes.bigint ],
  ];
  static dbFrom = 'rows';
  static dbOrderBy = 'timecode';
}

module.exports = Row;
