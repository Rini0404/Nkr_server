// src/server.ts

import express from 'express';
import http from 'http';
import { initializeWebSocket } from './socket';

const app = express();
const PORT = 3000;

const server = http.createServer(app);

// Initialize WebSocket with the HTTP server
initializeWebSocket(server);

app.get('/', (req, res) => {
    res.send('Hello from the TypeScript server!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
