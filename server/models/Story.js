const { dataTypes, Model } = require('../lib/model');

class Story extends Model {
  static cacheKey = 'story';
  static cacheRoutePatterns = [
    '/',
  ];
  static dbFields = [
    [ 'id', dataTypes.bigint ],
    [ 'ordering', dataTypes.bigint ],
    [ 'title', dataTypes.varchar ],
    [ 'story_text', dataTypes.varchar ],
  ];
  static dbFrom = 'stories';
  static dbOrderBy = 'ordering';
}

module.exports = Story;
