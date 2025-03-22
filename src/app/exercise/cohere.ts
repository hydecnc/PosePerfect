import { CohereClientV2, Cohere } from "cohere-ai";
import { url } from "inspector";
import util from "util";
import { promises as fs } from "fs";

const SYSTEM_PROMPT = `
You are a virtual fitness assistant specializing in squat form analysis. Your task is to review detailed squat session data and provide actionable, insightful feedback focusing on:
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

Please answer the next prompts with short sentences.
`;

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});
let isInitialized = false;

let lowestAngle = Infinity;
let highestAngle = -Infinity;

const exercisesOptions = [
  "no user",
  "no exercise",
  "squat",
  "sit up",
  "push up",
  "deadlift"
]

const detectExercisePrompt = `Out of the following options, which exercise is the user performing? ${exercisesOptions.join(", ")}`

// For testing
export async function imageToBase64(imagePath: string, format: string = "jpeg") {
  const image = await fs.readFile(imagePath);
  const bufData = Buffer.from(image).toString('base64');
  return `data:image/${format};base64,${bufData}`;
}

/**
 * 
 * @param exerciseImage base64 encoded image of user preforming the exercise.
 */
export async function detectExercise(exerciseImage: string) {
  const response = await cohere.chat({
    model: "c4ai-aya-vision-32b",
    messages: [
      {
        role: "user",
        content: [
          {type: "text", text: detectExercisePrompt},
          {type: "image_url", imageUrl: {url: exerciseImage}},
        ],
      },
    ],
  })
  console.log(util.inspect(response, {colors: true, depth: 20}));
}

export async function getExerciseFeedback(exerciseName: string, selectedSide: SelectedSide) {
  // Calculate the min/max angles from the selected side
  const dx = selectedSide.hip.position.x - selectedSide.shoulder.position.x;
  const dy = selectedSide.hip.position.y - selectedSide.shoulder.position.y;
  const angleRad = Math.atan2(dx, dy);
  const angleDeg = Math.abs(angleRad * (180 / Math.PI));

  lowestAngle = Math.min(lowestAngle, angleDeg);
  highestAngle = Math.max(highestAngle, angleDeg);

  const messages: Cohere.ChatMessages = [
    {
      role: "system",
      content: `The user's current lowest angle is ${lowestAngle} and highest angle is ${highestAngle}. Joint position data: ${JSON.stringify(selectedSide)}`
    },
  ]

  if (!isInitialized) {
    messages.unshift({
      role: "system",
      content: SYSTEM_PROMPT,
    })
    messages.unshift({
      role: "system",
      content: `The user is preforming the exercise ${exerciseName}.`
    })
    isInitialized = true;
  }

  const response = await cohere.chat({
    model: 'command-r-plus-08-2024',
    messages: messages,
  });

  console.log(util.inspect(response, {colors: true, depth: 20}));

  return response.message.content;
}

