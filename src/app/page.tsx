"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  // State to capture the user's selection
  const [selectedExercise, setSelectedExercise] = useState("squat");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.title}>PosePerfect</div>
        <div className={styles.start}>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="squat">Squat</option>
            <option value="rdl">Romanian Deadlifts</option>
            <option value="lunges">Lunges</option>
            <option value="planks">Planks</option>
            <option value="pushups">Push-ups</option>
            <option value="shoulder_press">Shoulder Press</option>
          </select>
          <Link
            href={{
              pathname: '/exercise',
              query: { exercise: selectedExercise }
            }}
          >
            <button className={styles.start}>Get started here:</button>
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/hydecnc/gymmi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Link to Repo
        </a>
      </footer>
    </div>
  );
}
