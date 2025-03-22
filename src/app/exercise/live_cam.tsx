"use client";

import { useEffect, useRef } from "react";
import styles from "./exercise.module.css";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl"; // Ensure this backend is set up

export default function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Set up the webcam stream
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    // Load PoseNet and start detection
    async function loadAndDetectPose() {
      await setupCamera();
      let config: posenet.ModelConfig = {
        architecture: "MobileNetV1",
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
      };
      const net = await posenet.load(config);
      // const net = await posenet.load({
      //   inputResolution: { width: 640, height: 480 },
      // });

      async function detectPose() {
        if (videoRef.current) {
          // Estimate the pose from the current video frame
          const pose = await net.estimateSinglePose(videoRef.current, {
            flipHorizontal: false,
          });
          console.log("Detected Pose:", pose);
        }
        requestAnimationFrame(detectPose);
      }

      detectPose();
    }

    loadAndDetectPose();
  }, []);

  return (
    <div className={styles.camerDisplay}>
      <video
        ref={videoRef}
        width={640}
        height={480}
        playsInline
        muted
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
}
