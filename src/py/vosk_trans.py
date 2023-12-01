import sys
import json
from vosk import Model, KaldiRecognizer

model_path = "/Users/reneortega/Desktop/StellarApps/proj_nkr/nkr-server/vosk-model-en-us-0.22"
model = Model(model_path)
rec = KaldiRecognizer(model, 16000)
# rec.SetWords(True)  # To get word-by-word confidence scores

while True:
    data = sys.stdin.buffer.read(2000)  # Some fixed chunk size, adjust as needed
    
    if not data:
        break  # Exit the loop if there's no data

    if rec.AcceptWaveform(data):
        result = json.loads(rec.Result())
        print(result['text'])
        # print(result['result'])  # This will print word-by-word results with confidence scores
        sys.stdout.flush()
