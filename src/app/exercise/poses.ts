"use client"
import { Pose } from "@tensorflow-models/posenet";
import { getBetterSide } from "./preprocess"
import { getSideKeypoints } from "./exerciseProcessor"
import { CohereInstance } from "./cohere"

// in milliseconds
const poll_interval = 20000

export abstract class ExerciseAnalysis {
  constructor(cohere: CohereInstance) {
    // Send the base initial prompt.
    cohere.sendMessage(this.initialPrompt(), true);
  }

  abstract initialPrompt(): string
  abstract evaluate(pose: Pose, cohere: CohereInstance): Promise<string>
}

export class SquatExercise extends ExerciseAnalysis {
  private lowestAngle!: number;
  private highestAngle!: number;
  private angleChange!: number[];
  private lastAngle!: number;
  private lastPoll!: number;

  constructor(cohere: CohereInstance) {
    super(cohere);
    this.reset();
  }

  initialPrompt() {
    return `You are a virtual fitness assistant specializing in squat form analysis. Your task is to review detailed squat session data and provide actionable, insightful feedback focusing on:
- Joint angles
- Squat depth
- Balance
- Execution speed

Ensure your analysis:
- Includes practical tips for improvement.
- Highlights both strengths and areas needing correction.
- Uses a colorful, engaging style to maintain the user's interest.
- Contains a touch of humor to keep the tone light and motivating.

Important: The squat data is collected from only one side (either left or right), so do not comment on the spacing between the legs.

Please answer the next prompts with short sentences.`
  }

  reset() {
    this.lowestAngle = Infinity;
    this.highestAngle = -Infinity;
    this.lastAngle = NaN;
    this.angleChange = [];
    this.lastPoll = Date.now();
  }

  async evaluate(pose: Pose, cohere: CohereInstance) {
    const betterSide = getBetterSide(pose)

    if (betterSide == "unknown") {
      console.log("Failed to get pose on", pose);
      return "";
    }

    const selectedSide = getSideKeypoints(pose, betterSide)
    const dx = selectedSide.hip.position.x - selectedSide.shoulder.position.x;
    const dy = selectedSide.hip.position.y - selectedSide.shoulder.position.y;
    const angleRad = Math.atan2(dx, dy);
    const angleDeg = Math.abs(angleRad * (180 / Math.PI));
  
    this.lowestAngle = Math.min(this.lowestAngle, angleDeg);
    this.highestAngle = Math.max(this.highestAngle, angleDeg);
  
    if (!isNaN(this.lastAngle)) {
      this.angleChange.push(angleDeg - this.lastAngle)
    }
    this.lastAngle = angleDeg;

    if (Date.now() - this.lastPoll > poll_interval) {
      const lowestAngle = this.lastAngle
      const highestAngle = this.highestAngle
      const angleChanges = this.angleChange.join(", ")
      const jointData = JSON.stringify(selectedSide)
      this.reset();

      const response = await cohere.sendMessage(`The user's current lowest angle is ${lowestAngle} and highest angle is ${highestAngle}. Angle changes since last message: ${angleChanges}. Current joint position data: ${jointData}.`);
      return response;
    }

    return ""
  }
}