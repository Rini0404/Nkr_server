// src/socket/index.ts

import { Server } from 'ws';

export const initializeWebSocket = (server: any) => {
    const wss = new Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Handle messages received from clients
        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        // You can also set up other event listeners, like for handling errors or when the socket closes.

        ws.send('Welcome to the WebSocket server!');
    });

    return wss; // This can be useful if you need to reference the WebSocket server elsewhere.
};
