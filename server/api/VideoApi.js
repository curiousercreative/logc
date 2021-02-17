const Api = require('../lib/api/Api.js');
const Video = require('../models/Video.js');

class VideoApi extends Api {
  static model = Video;
}

module.exports = VideoApi;
