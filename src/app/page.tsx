"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import PoseCamera from "./exercise/live_cam"; // adjust path if needed

export default function Home() {
  const [selectedExercise, setSelectedExercise] = useState("squat");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.title}>Gymmi</div>
        
        {/* Dropdown for selecting an exercise */}
        <div className={styles.start}>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="squat">Squat</option>
            <option value="deadlifts">Deadlifts</option>
            <option value="lunges">Lunges</option>
            <option value="planks">Planks</option>
            <option value="push-ups">Push-ups</option>
            <option value="shoulder press">Shoulder Press</option>
          </select>
        </div>

        {/* PoseCamera receives the selected exercise as a prop */}
        <PoseCamera exercise={selectedExercise} />
        
        <div className={styles.start}>
          <a href="/exercise">
            <button>Get started here:</button>
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/hydecnc/gymmi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Link to Repo
        </a>
      </footer>
    </div>
  );
}
