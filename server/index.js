const express = require('express');
const http = require('http');
const PubSub = require('pubsub-js');
const WebSocket = require('ws');
const url = require('url');

const redis = require('./lib/redis.js');

const RowApi = require('./api/RowApi.js');
const StoryApi = require('./api/StoryApi.js');
const StrapiWebhookApi = require('./api/StrapiWebhookApi.js');
const VideoApi = require('./api/VideoApi.js');

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

// TODO: authorization middleware
// TODO: request cleaning middleware
// TODO: request validation middleware
// TODO: can/should cache be middleware?


app.all('/story/:id?', StoryApi.handleRoute.bind(StoryApi));
app.all('/video/:video_id/row/', RowApi.handleRoute.bind(RowApi));
app.all('/video/:id?', VideoApi.handleRoute.bind(VideoApi));

app.post('/strapi-webhook', StrapiWebhookApi.post.bind(StrapiWebhookApi))

server.listen(port);
