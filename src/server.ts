const { Server } = require("socket.io");
import express from "express";
import http from "http";

const app = express();
const PORT = 3000;

const server = http.createServer(app);

type Message = {
    message: string;
};


const io = new Server(server, {
    cors: {
        origin: "*"
    },
});



io.on("connection", (socket: any) => {
    console.log("a user connected");
    socket.emit("message", "Hello from server");
    socket.on('audio_chunk', (audioData: any) => {
        // Here, handle the audio data. For now, just printing it:
        console.log('Received audio chunk')
    })
});



app.get("/", (req, res) => {
  res.send("Hello from the TypeScript server!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
