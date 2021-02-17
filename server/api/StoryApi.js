const Api = require('../lib/api/Api.js');
const Story = require('../models/Story.js');

class StoryApi extends Api {
  static model = Story;
}

module.exports = StoryApi;
