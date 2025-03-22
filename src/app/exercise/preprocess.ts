// Code for pre-processing the pose information of the user.

const minScore = 0.6;

interface Position {
  x: number;
  y: number;
}

interface KeyPoint {
  part: string;
  position: Position;
  score: number;
}

interface BodySide {
  shoulder: KeyPoint;
  elbow: KeyPoint;
  wrist: KeyPoint;
  hip: KeyPoint;
  knee: KeyPoint;
  ankle: KeyPoint;
}

interface SelectedSide extends BodySide {
  side: 'left' | 'right';
}

function selectSide(keyPoints: KeyPoint[]): SelectedSide | null {
  // Key parts we need: shoulder, hip, knee, and ankle.
  const left: BodySide = {
    shoulder: keyPoints.find(k => k.part === 'leftShoulder')!,
    elbow: keyPoints.find(k => k.part === 'leftElbow')!,
    wrist: keyPoints.find(k => k.part === 'leftWrist')!,
    hip: keyPoints.find(k => k.part === 'leftHip')!,
    knee: keyPoints.find(k => k.part === 'leftKnee')!,
    ankle: keyPoints.find(k => k.part === 'leftAnkle')!,
  };
  const right: BodySide = {
    shoulder: keyPoints.find(k => k.part === 'rightShoulder')!,
    elbow: keyPoints.find(k => k.part === 'rightElbow')!,
    wrist: keyPoints.find(k => k.part === 'rightWrist')!,
    hip: keyPoints.find(k => k.part === 'rightHip')!,
    knee: keyPoints.find(k => k.part === 'rightKnee')!,
    ankle: keyPoints.find(k => k.part === 'rightAnkle')!,
  };

  // Calculate average confidence for each side (only count those above threshold)
  const avgScore = (side: BodySide): number => {
    const scores: number[] = [];
    Object.values(side).forEach((kp: KeyPoint | undefined) => {
      if (kp && kp.score >= minScore) scores.push(kp.score);
    });
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  const leftAvg = avgScore(left);
  const rightAvg = avgScore(right);

  if (leftAvg >= rightAvg && leftAvg > 0) {
    return { ...left, side: 'left' };
  } else if (rightAvg > 0) {
    return { ...right, side: 'right' };
  }
  return null;
}
