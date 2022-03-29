import { mapFaceResult } from './map-face-result';
import { LivenessActionResult } from './face-detection.interface';
import { IHumanFaceResult } from './human.interface';

const getCurrentLevel = (gestures: LivenessActionResult): number => {
  let back = 100;
  const gesturesLength = Object.keys(gestures).length;
  if (gestures.facingCamera) {
    back = gesturesLength;
  }
  if (gestures.blinkLeft) {
    back += 10;
  }
  if (gestures.blinkRight) {
    back += 10;
  }
  if (gestures.mouth) {
    back += 30;
  }
  return back;
};

// get better face-photo
export const getBetterPhoto = (
  currentBetterLevel: number,
  newFaceData: IHumanFaceResult,
  currnetFaceData?: IHumanFaceResult
) => {
  const gesture = mapFaceResult(newFaceData);
  const newLevel = getCurrentLevel(gesture);

  let isBetter = false;
  let level = currentBetterLevel;
  // get better photo
  if (newLevel === currentBetterLevel) {
    // TODO: Calculate data scores to judge if it is better
  }
  // level smaller is better
  else if (newLevel < currentBetterLevel) {
    level = newLevel;
    isBetter = true;
  }

  // TODO:
  if (currnetFaceData) {
    //
  }

  return {
    level,
    isBetter
  };
};
