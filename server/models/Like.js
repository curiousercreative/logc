const { dataTypes, Model } = require('../lib/model');

class Row extends Model {
  static cacheKey = 'row';
  static cacheRoutePatterns = [
    '/video/:videoId/rows/',
  ];
  static dbFields = [
    [ 'id', dataTypes.bigint ],
    [ 'video_id', dataTypes.bigint ],
    [ 'user_id', dataTypes.bigint ],
    [ 'created', dataTypes.bigint ],
    [ 'row_id', dataTypes.bigint ],
  ];
  static dbFrom = 'rows';
  static dbOrderBy = 'timecode';
}

module.exports = Row;
