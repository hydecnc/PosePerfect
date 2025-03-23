"use client"
import { createRef } from "react"

// Create a regular AudioContext (not using React hooks)
let audioContext: AudioContext | null = null;
// Use a regular ref object instead of useRef
const sourceRef = createRef<AudioBufferSourceNode | null>();

export async function playAudio(buffer: Buffer) {
  // Initialize AudioContext on first use (to handle browser autoplay policies)
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  // Stop the previous audio if it exists
  if (sourceRef.current) {
    try {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
    } catch (e) {
      console.log("Error stopping previous audio:", e);
    }
  }

  try {
    const arrayBuffer = new Uint8Array(buffer).buffer;
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

    // Save the new source reference
    sourceRef.current = source;

    // Clean up when audio finishes playing
    source.onended = () => {
      if (sourceRef.current === source) {
        sourceRef.current = null;
      }
    };
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}
