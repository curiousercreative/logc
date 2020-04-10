const { dataTypes, Model } = require('../lib/model');

module.exports = class Video extends Model {
  static cacheKey = 'video';
  static cacheRoutePatterns = [
    '/',
    '/videos/',
    '/videos/:id',
  ]
  static dbFields = [
    [ 'id', dataTypes.bigint ]
    [ 'src', dataTypes.varchar ],
    [ 'title', dataTypes.varchar ],
  ];
  static dbFrom = 'videos';
}
