import * as posenet from "@tensorflow-models/posenet";

export function getSideKeypoints(pose: any, side: any) {
    return {
      shoulder: pose.keypoints.find((k:any) => k.part === `${side}Shoulder`),
      elbow: pose.keypoints.find((k:any) => k.part === `${side}Elbow`),
      wrist: pose.keypoints.find((k:any) => k.part === `${side}Wrist`),
      hip: pose.keypoints.find((k:any) => k.part === `${side}Hip`),
      knee: pose.keypoints.find((k:any) => k.part === `${side}Knee`),
      ankle: pose.keypoints.find((k:any) => k.part === `${side}Ankle`),
      side,
    };
  }  

export function oneSideData(pose:any, selected:any, data:any) {

    
      const leftHip = pose.keypoints.find((kp:any) => kp.part === "leftHip");
      const leftKnee = pose.keypoints.find((kp:any) => kp.part === "leftKnee");
      const depth = leftHip && leftKnee ? Math.abs(leftHip.position.y - leftKnee.position.y) : 0;
      data.push({
        shoulder: selected.shoulder,
        elbow: selected.elbow,
        wrist: selected.wrist,
        hip: selected.hip,
        knee: selected.knee,
        ankle: selected.ankle,
      });
      

}
export function twoSideData(pose:any, left:any, right:any, data:any) {

    const leftHip = pose.keypoints.find((kp:any) => kp.part === "leftHip");
    const leftKnee = pose.keypoints.find((kp:any) => kp.part === "leftKnee");
    const depth = leftHip && leftKnee ? Math.abs(leftHip.position.y - leftKnee.position.y) : 0;
    data.push({
      shoulder: left.shoulder,
      elbow: left.elbow,
      wrist: left.wrist,
      hip: left.hip,
      knee: left.knee,
      ankle: left.ankle,
    });
    data.push({
      shoulder: right.shoulder,
      elbow: right.elbow,
      wrist: right.wrist,
      hip: right.hip,
      knee: right.knee,
      ankle: right.ankle,
    });
  
}

