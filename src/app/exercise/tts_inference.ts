import * as dotenv from "dotenv";
dotenv.config(); // Loads .env into process.env

import fetch from "node-fetch";
import * as fs from "fs";

// 1. Read HF_TOKEN from environment
const HF_TOKEN = process.env.HF_TOKEN;

// 2. Define the Inference API URL
const API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits";

/**
 * Sends text to the Hugging Face Inference API for TTS
 * and returns raw audio bytes (WAV format).
 */
async function textToSpeech(text: string): Promise<Buffer> {
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN not found in environment variables.");
  }

  const headers = {
    "Authorization": `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json"
  };

  const payload = { inputs: text };

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }

  // Convert the ArrayBuffer to a Buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  try {
    const sampleText = "To improve your squat form, focus on keeping your chest up and your back straight throughout the movement. Push your hips back as if sitting into a chair, and ensure your knees track over your toes without caving inward. Engage your core to maintain stability, and avoid letting your heels lift off the ground. Practice with bodyweight squats before adding weights to perfect your technique.";
    const audioBytes = await textToSpeech(sampleText);

    fs.writeFileSync("output.wav", audioBytes);
    console.log("TTS audio saved to output.wav");
  } catch (error) {
    console.error("Error generating TTS:", error);
  }
}

if (require.main === module) {
  main();
}
