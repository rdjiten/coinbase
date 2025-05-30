import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import 'dotenv/config';
import { setupWebSocketProxy } from './websocket/proxy';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

setupWebSocketProxy(wss);


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
