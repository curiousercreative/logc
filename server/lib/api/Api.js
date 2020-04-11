class Api {
  static model;

  static delete (params) {

  }

  static get (params) {
    return this.model.get(params);
  }

  static patch (params, body) {
    return this.model.update(body, params);
  }

  static post (params, body) {
    return this.model.create(body, params);
  }

  static put (params, body) {
    return this.model.update(body, params);
  }

  static handleRoute (req, res) {
    try {
      return this[req.method.toLowerCase()](req.params, req.body)
        .then(body => res.json(body))
        .catch(error => res.status(500).send(`something went wrong \n ${error}`));
    }
    catch (e) {
      // TODO: error sniff here to make sure we're actually missing a route
      return Promise.resolve()
        .then(() => res.status(404).send('not found'))
    }
  }
}

module.exports = Api;
