//server.ts

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const {transcribeWithVosk}  = require('./utils/transcriber')
const app = express();
const httpServer = http.createServer(app);
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const path = require('path');
const scriptPath = path.join(__dirname, './py-scripts/deepspeech_transcribe.py');


const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
});

io.on('connection', (socket: { on: (arg0: string, arg1: (audioData: any) => Promise<void>) => void; }) => {
    console.log('Client connected.');
    socket.on('audio_chunk', async (audioData: any) => {
        try {
            // 1. Save Base64 audio data to a file
            const audioFilePath = 'received_audio.mp3';  
            base64ToFile(audioData, audioFilePath);
    
            // 2. Convert the file to PCM format
            const pcmFilePath = 'audio.pcm';
            await convertToPCM(audioFilePath, pcmFilePath);
            
            // Read the PCM data
            const pcmData = fs.readFileSync(pcmFilePath);
            
            // 3. Transcribe PCM File using Vosk
            const transcription = await transcribeWithVosk(pcmData);
            console.log('Transcription:', transcription);
            io.emit('transcription', transcription);
    
        } catch (error) {
            console.error('Error with Vosk transcription:', error);
        }
    });
});

function base64ToFile(data: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }, outputPath: string) {
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(outputPath, buffer);
}

function convertToPCM(inputFile: string, outputFile: string) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputFile)
            .toFormat('s16le')
            .audioChannels(1)
            .audioFrequency(16000)
            .on('end', resolve)
            .on('error', reject)
            .save(outputFile);
    });
}


const PORT = 3000;

httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
