const express = require('express');
const http = require('http');
const PubSub = require('pubsub-js');
const redis = require('redis');
const WebSocket = require('ws');
const url = require('url');

const REDIS_CONFIG = { host: 'redis' };

const app = express();
const redisClient = redis.createClient(REDIS_CONFIG);
const redisSub = redis.createClient(REDIS_CONFIG);
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
    redisClient.publish('ws', msg);
  });

  ws.on('close', () => {
    redisClient.publish('ws', 'ws closed');
    PubSub.unsubscribe(unsubToken);
  });
});

redisSub.on('message', (channel, msg) => {
  PubSub.publish(channel, msg);
});
redisSub.subscribe('ws');

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
app.get('/', (req, res) => res.send(`
  Hello World!
  <script type="text/javascript">
    const ws = new WebSocket(\`ws://\${window.location.hostname}:\${window.location.port}/websocket\`);
    ws.onmessage = ({ data }) => document.write(data);
  </script>
`));

server.listen(port);
