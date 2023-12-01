// transcriber.ts

const { spawn } = require("child_process");
const path = require("path");

const scriptPath = path.join(__dirname, "../py/vosk_trans.py");

// Start the Python process just once
const pythonProcess = spawn('python3', [scriptPath]);


export function transcribeWithVosk(audioData: any) {
    return new Promise((resolve, reject) => {
        // Log standard output (stdout)
        pythonProcess.stdout.once('data', (data: any) => {
            console.log('Python Output:', data.toString());
            resolve(data.toString());
        });

        // Log errors (stderr)
        pythonProcess.stderr.once('data', (data: any) => {
            console.error('Python Error:', data.toString());
            reject(data.toString());
        });

        // Write audio data to Python process for processing
        pythonProcess.stdin.write(audioData);
    });
}