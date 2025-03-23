"use client";

import { useEffect, useRef } from "react";
import styles from "./exercise.module.css";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl"; // Ensure this backend is set up
import { getBetterSide } from "./preprocess"; 
import {oneSideData, twoSideData, getSideKeypoints} from "./exerciseProcessor"; // import your functions
import { data } from "@tensorflow/tfjs";

const data_frame: any[] = [];


let hasCheckedSide = false; // new flag
let sideChoice = ""; // store best side
interface Props {
  exercise: string;
}
export default function LiveCamera({exercise}:Props) {
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


      async function detectPose() {
        if (videoRef.current) {
          // Estimate the pose from the current video frame
          const pose = await net.estimateSinglePose(videoRef.current, {
            flipHorizontal: false,
          });
        
              if (exercise == "squat" || exercise == "rdl" || exercise == "lunges") {
              
                // Call your function here
                console.log("ONE SELECTION: ");
                const selected = getSideKeypoints(pose, "left" );
        
                oneSideData(pose, selected, data_frame);

              }
              else if (exercise == "pushups" || exercise == "shoulder_press") {
                console.log("TWO SELECTION: ");
                const selected_left = getSideKeypoints(pose,  "left" );
                const selected_right = getSideKeypoints(pose,  "right" );
                twoSideData(pose, selected_left, selected_right, data_frame);

              }
              else{
                console.error("Invalid exercise");
              }
        }
        requestAnimationFrame(detectPose);
      }

      detectPose();
      
    }

    loadAndDetectPose();
  }, []);

  return (
   
      <video className= {styles.cameraDisplay}
        ref={videoRef}
      
      />
  );
}
