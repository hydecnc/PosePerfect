"use server"
import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";

// Retrieve the Hugging Face API token from environment variables
const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  throw new Error("HF_TOKEN not set in environment variables. Check your .env file.");
}

// Define the Inference API endpoint for the espnet/kan-bayashi_ljspeech_vits model
const API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits";

// Interface for configurable options
interface TTSOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Sends text to the Hugging Face Inference API for TTS and returns a Buffer containing the WAV audio.
 * Uses a retry loop with exponential backoff plus random jitter.
 *
 * @param text - The text to synthesize.
 * @param options - Optional configuration (number of retries, base delay, and maximum delay).
 * @returns A Promise resolving to a Buffer containing the audio data.
 */
export async function textToSpeech(text: string, options?: TTSOptions): Promise<Buffer> {
  const retries = options?.retries ?? 5;
  const baseDelayMs = options?.baseDelayMs ?? 2000;
  const maxDelayMs = options?.maxDelayMs ?? 20000;

  const headers = {
    "Authorization": `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
  };
  const payload = { inputs: text };

  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Successfully received audio data (in WAV format)
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } else {
        const errorText = await response.text();
        console.error(
          `[${new Date().toISOString()}] Attempt ${attempt + 1} failed with status ${response.status}: ${errorText}`
        );
      }
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Attempt ${attempt + 1} encountered an error:`,
        err
      );
    }
    attempt++;

    // Exponential backoff with random jitter (up to 1 second extra)
    const jitter = Math.floor(Math.random() * 1000);
    const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + jitter, maxDelayMs);
    console.log(`[${new Date().toISOString()}] Waiting ${delay} ms before retrying...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error("Max retries reached. TTS service is unavailable or experiencing issues.");
}

/**
 * Main function: synthesizes speech from text and saves the output to a WAV file.
 * Optionally, text can be provided via the command line (process.argv[2]).
 */
async function main() {
  // Use command-line text input if provided; otherwise, use default sample text.
  const sampleText =
    process.argv[2] ||
    "Hello! This is an advanced text-to-speech demonstration using the espnet Kan-Bayashi VITS model. Enjoy the synthesized speech.";
  try {
    console.log(`[${new Date().toISOString()}] Starting TTS generation for text: "${sampleText}"`);
    const audioBuffer = await textToSpeech(sampleText, { retries: 5, baseDelayMs: 2000, maxDelayMs: 20000 });
    const outputFile = path.join(__dirname, "output.wav");
    fs.writeFileSync(outputFile, audioBuffer);
    console.log(`[${new Date().toISOString()}] TTS audio saved to ${outputFile}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error generating TTS:`, err);
  }
}

// main();

