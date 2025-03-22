import styles from "./exercise.module.css";
import PoseCamera from "./live_cam"; // adjust path if needed

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={`${styles.cameraDisplay} ${styles.niceBox}`}>
          <PoseCamera />
        </div>
        <div className={styles.exerciseInfo}>
          <div className={`${styles.exerciseName} ${styles.niceBox}`}>
            Push Up
          </div>
          <div className={`${styles.chatLog} ${styles.niceBox}`}>Push Up</div>
        </div>
      </main>
    </div>
  );
}
