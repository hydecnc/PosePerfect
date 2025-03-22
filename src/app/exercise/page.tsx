import styles from "./exercise.module.css";
import PoseCamera from "./live_cam";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={`${styles.cameraDisplayContainer} ${styles.niceBox}`}>
          <PoseCamera />
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
