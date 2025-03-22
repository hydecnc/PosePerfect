import Image from "next/image";
import styles from "./exercise.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={`${styles.cameraDisplay} ${styles.niceBox}`}>
          CAMERA
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
