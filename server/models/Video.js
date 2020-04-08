const Model = require('../lib/Model.js');

module.exports = class Video extends Model {
  static cacheKey = 'video';
  static dbSchema = 'videos';
}
