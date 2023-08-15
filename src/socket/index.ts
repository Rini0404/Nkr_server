// src/socket/index.ts

import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { Server, OPEN } from "ws";

export const initializeWebSocket = (server: any) => {
  const wss = new Server({ noServer: true });
  console.log("WebSocket server created")
  server.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    console.log("Received upgrade request:", request.url);
      if (request.url === "/mySocket") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    }
  );

  wss.on("connection", (ws) => {
    if (ws.readyState === OPEN) {
      ws.send("Connected to specific route");
    }

    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
    });
  });
};
