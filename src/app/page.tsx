import Image from "next/image";
import styles from "./page.module.css";
import PoseCamera from "./exercise/live_cam"; // adjust path if needed

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
  <div className={styles.title}>Gymmi</div>
      <PoseCamera />
        <div className={styles.title}>Gymmi</div>
        <div className={styles.start}>
          <a href="/exercise">
            <button className={styles.start}>Get started here:</button>
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
