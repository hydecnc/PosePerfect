import Image from "next/image";
import styles from "./page.module.css";
import PoseCamera from "./exercise/live_cam";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl text-center text-white my-4">Pose Detection</h1>
      <PoseCamera />
    </div>
  );
}
