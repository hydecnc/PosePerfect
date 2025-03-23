"use client";

import styles from "./exercise.module.css";
import PoseCamera from "./live_cam";
import { useSearchParams } from "next/navigation";


export default function ExercisePage() {
  const searchParams = useSearchParams();
  const exercise = searchParams.get("exercise") || "squat";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={`${styles.cameraDisplayContainer} ${styles.niceBox}`}>
        <PoseCamera exercise={exercise} />
        </div>
        <div className={styles.exerciseInfo}>
          <div className={`${styles.exerciseName} ${styles.niceBox}`}>
            <div>Squat Exercises</div>
          </div>
          <div className={`${styles.chatLog} ${styles.niceBox}`}>
            Feedback + Instructions
          </div>
        </div>
      </main>
    </div>
  );
}
