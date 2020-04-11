const StoryApi = require('./StoryApi.js');
const VideoApi = require('./VideoApi.js');

const omit = require('../../shared/util/omit.js');

const API_MAP = {
  story: StoryApi,
  video: VideoApi,
};
const EVENT_METHOD_MAP = {
  update: 'patch',
};
const EVENT_METHOD_REGEX = /^entry\.([a-z]+)$/;
const METHOD_STATUS_MAP = {
  create: 201,
}
const RELATED_KEY = 'app_id';
const STRAPI_KEYS_TO_OMIT = [ RELATED_KEY, 'id', 'created_at', 'updated_at' ];
const STRAPI_RELATIONAL_FIELD_REGEX = /^.*_id$/;

class StrapiWebhookApi {
  static getMethod (body) {
    return EVENT_METHOD_MAP[body.event.match(EVENT_METHOD_REGEX)[1]];
  }

  static getApi (body) {
    return API_MAP[body.model];
  }

  static getParams (body) {
    return {
      ...Object.fromEntries(
        Object
          .entries(body.entry)
          .filter(([ k ]) => k !== RELATED_KEY && k.match(STRAPI_RELATIONAL_FIELD_REGEX))
      ),
      id: body.entry[RELATED_KEY],
    };
  }

  static post (req, res) {
    // validate and authorization, etc
    const api = this.getApi(req.body);
    const method = this.getMethod(req.body);
    const params = this.getParams(req.body);

    const body = {
      ...omit(STRAPI_KEYS_TO_OMIT, res.body.entry),
      id: req.body.entry[RELATED_KEY],
    };

    if (method in api) {
      return api[method](params, body)
        .then(res.status(METHOD_STATUS_MAP[method] || 200))
        .catch(api.send500(res));
    }

    return api.send404(res);
  }
}

module.exports = StrapiWebhookApi;
