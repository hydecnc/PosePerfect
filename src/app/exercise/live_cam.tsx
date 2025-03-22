"use client";

import { useEffect, useRef } from "react";

export default function ExercisePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    setupCamera();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-3xl mb-4">Live Camera Feed</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-lg rounded-xl border-4 border-white"
      />
    </div>
  );
}
