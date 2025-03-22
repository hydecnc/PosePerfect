import * as posenet from "@tensorflow-models/posenet";

const minScore = 0.6;

export function avgScore(side: Record<string, posenet.Keypoint | undefined>): number {
  const scores: number[] = [];
  Object.values(side).forEach((kp) => {
    if (kp && kp.score >= minScore) scores.push(kp.score);
  });
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

export function getBetterSide(pose: posenet.Pose): "left" | "right" | "unknown" {
  const left = {
    shoulder: pose.keypoints.find((k) => k.part === "leftShoulder"),
    elbow: pose.keypoints.find((k) => k.part === "leftElbow"),
    wrist: pose.keypoints.find((k) => k.part === "leftWrist"),
    hip: pose.keypoints.find((k) => k.part === "leftHip"),
    knee: pose.keypoints.find((k) => k.part === "leftKnee"),
    ankle: pose.keypoints.find((k) => k.part === "leftAnkle"),
  };

  const right = {
    shoulder: pose.keypoints.find((k) => k.part === "rightShoulder"),
    elbow: pose.keypoints.find((k) => k.part === "rightElbow"),
    wrist: pose.keypoints.find((k) => k.part === "rightWrist"),
    hip: pose.keypoints.find((k) => k.part === "rightHip"),
    knee: pose.keypoints.find((k) => k.part === "rightKnee"),
    ankle: pose.keypoints.find((k) => k.part === "rightAnkle"),
  };

  const leftAvg = avgScore(left);
  const rightAvg = avgScore(right);

  if (leftAvg === 0 && rightAvg === 0) return "unknown";
  return leftAvg >= rightAvg ? "left" : "right";
}
