"use client";

import { useEffect, useRef } from "react";
import styles from "./exercise.module.css";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs-backend-webgl"; // Ensure this backend is set up
import { getBetterSide } from "./preprocess"; 
import {oneSideData, twoSideData, getSideKeypoints} from "./exerciseProcessor"; // import your functions
import { data } from "@tensorflow/tfjs";
import { copyModel } from "@tensorflow/tfjs-core/dist/io/model_management";

const data_frame: any[] = [];


let hasCheckedSide = false; // new flag
let sideChoice = ""; // store best side
interface Props {
  exercise: string;
}
export default function LiveCamera({exercise}:Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let apiInterval: number; // interval ID for cleanup

    // Function to be called every 30 seconds
    function aiApiCall() {
      console.log("API CALLED Here");
      // Optionally, clear the data after calling the API
      data_frame.splice(0, data_frame.length);
    }

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

      // Start the interval that calls aiApiCall every 10 seconds
      apiInterval = window.setInterval(() => {
        aiApiCall();
      }, 30000);

      async function detectPose() {
        if (videoRef.current) {
          // Estimate the pose from the current video frame
          const pose = await net.estimateSinglePose(videoRef.current, {
            flipHorizontal: false,
          });
        
              if (exercise == "squat" || exercise == "rdl" || exercise == "lunges") {
              
                // Call your function here
                const selected = getSideKeypoints(pose, "left" );
        
                oneSideData(pose, selected, data_frame);

              }
              else if (exercise == "pushups" || exercise == "shoulder_press") {
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
     // Clean up the interval when the component unmounts
     return () => {
      clearInterval(apiInterval);
    };
  }, []);

  return (
   
      <video className= {styles.cameraDisplay}
        ref={videoRef}
      
      />
  );
}
