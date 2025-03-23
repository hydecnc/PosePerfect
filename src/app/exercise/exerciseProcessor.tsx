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

      //console.log("Pose in oneSideData", selected);
      
      const leftHip = pose.keypoints.find((kp:any) => kp.part === "leftHip");
      const leftKnee = pose.keypoints.find((kp:any) => kp.part === "leftKnee");
      const depth = leftHip && leftKnee ? Math.abs(leftHip.position.y - leftKnee.position.y) : 0;
      data.push({
        shoulder: selected.shoulder.position,
        elbow: selected.elbow.position,
        wrist: selected.wrist.position,
        hip: selected.hip.position,
        knee: selected.knee.position,
        ankle: selected.ankle.position,
        side: selected.side,
      });
      console.log("Data in oneSideData", data);
    
}
export function twoSideData(pose:any, left:any, right:any, data:any) {

    const leftHip = pose.keypoints.find((kp:any) => kp.part === "leftHip");
    const leftKnee = pose.keypoints.find((kp:any) => kp.part === "leftKnee");
    const depth = leftHip && leftKnee ? Math.abs(leftHip.position.y - leftKnee.position.y) : 0;
    data.push({
      shoulder: left.shoulder.position,
      elbow: left.elbow.position,
      wrist: left.wrist.position,
      hip: left.hip.position,
      knee: left.knee.position,
      ankle: left.ankle.position,
      side: left.side,
    });
    data.push({
      shoulder: right.shoulder.position,
      elbow: right.elbow.position,
      wrist: right.wrist.position,
      hip: right.hip.position,
      knee: right.knee.position,
      ankle: right.ankle.position,
      side: right.side,
    });
    console.log("Data in TWO Sided", data);
  
}

