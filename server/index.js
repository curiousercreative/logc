const express = require('express');
const http = require('http');
const PubSub = require('pubsub-js');
const WebSocket = require('ws');
const url = require('url');

const redis = require('./lib/redis.js');

const StoryApi = require('./api/StoryApi.js');
const Video = require('./models/Video.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
const port = 3000;

// ==== Websocket server
wss.on('connection', function connection(ws) {
  let unsubToken = PubSub.subscribe('ws', (topic, msg) => {
    ws.send(msg);
  });

  ws.send('cool, a connection');

  ws.on('message', msg => {
    redis.client.publish('ws', msg);
  });
  ws.on('close', () => {
    redis.client.publish('ws', 'ws closed');
    PubSub.unsubscribe(unsubToken);
  });
});

redis.subscriber.on('message', (channel, msg) => {
  PubSub.publish(channel, msg);
});
redis.subscriber.subscribe('ws');

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/websocket') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// ==== API server
app.use(express.json());
app.get('/', (req, res) => res.send(`
  Hello World!
  <script type="text/javascript">
    const ws = new WebSocket(\`ws://\${window.location.hostname}:\${window.location.port}/websocket\`);
    ws.onmessage = ({ data }) => document.write(data);
  </script>
`));

function handleGetWithModel (model) {
  return (req, res) => {
    return model.get(req.params).then(data => res.json(data));
  }
}

function handlePostWithModel (model, method) {
  return (req, res) => {
    return model.post(req.params, req.body).then(data => res.json(data));
  }
}

function handlePutWithModel (model, method) {
  return (req, res) => {
    return model.put(req.params, req.body).then(data => res.json(data));
  }
}

function handlePatchWithModel (model, method) {
  return (req, res) => {
    return model.patch(req.params, req.body).then(data => res.json(data));
  }
}
// TODO: authorization middleware
// TODO: request cleaning middleware
// TODO: request validation middleware
// TODO: can/should cache be middleware?

app.route('/story/:id?')
  .get(handleGetWithModel(StoryApi))
  .post(handlePostWithModel(StoryApi));
app.put('/story/:id', handlePutWithModel(StoryApi));
app.patch('/story/', handlePutWithModel(StoryApi));

app.route('/video/:id?')
  .get(handleGetWithModel(Video))
  .post(handlePostWithModel(Video))
  .put(handlePutWithModel(Video));

server.listen(port);
