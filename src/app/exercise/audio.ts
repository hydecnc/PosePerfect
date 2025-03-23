"use client"

export async function playAudio(buffer: Buffer) {
  const arrayBuffer = new Uint8Array(buffer).buffer;

  const audioContext = new window.AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}
