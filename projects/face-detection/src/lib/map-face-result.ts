import { LivenessActionResult } from './face-detection.interface';
import { IHumanFaceResult } from './human.interface';

/**
 * Mapping face detection results
 * @param data A result detected that matches the condition
 */
export function mapFaceResult(face: IHumanFaceResult, rorateY = false): LivenessActionResult {
  const gestures = face.gesture;
  const temp: LivenessActionResult = { horizontal: 0, vertical: 0 };

  // the angle when head turned
  if (face.mesh) {
    const left = face.mesh[205][2];
    const right = face.mesh[425][2];
    const top = face.mesh[9][2];
    const bottom = face.mesh[200][2];
    temp.horizontal = right - left;
    temp.vertical = bottom - top;
  }

  gestures.forEach((gesture: string) => {
    if (gesture.match(/\d+/g)) {
      if (Number((<RegExpMatchArray>gesture.match(/\d+/g))[0]) > 35) {
        temp.mouth = true;
      }
    }
    switch (gesture) {
      case 'facing center': {
        temp.facingCamera = true;
        break;
      }
      case 'facing left': {
        if (temp.horizontal > 20) {
          rorateY ? (temp.facingRight = true) : (temp.facingLeft = true);
        }
        break;
      }
      case 'facing right': {
        if (temp.horizontal < -20) {
          rorateY ? (temp.facingLeft = true) : (temp.facingRight = true);
        }
        break;
      }
      case 'blink right eye': {
        rorateY ? (temp.blinkLeft = true) : (temp.blinkRight = true);
        break;
      }
      case 'blink left eye': {
        rorateY ? (temp.blinkRight = true) : (temp.blinkLeft = true);
        break;
      }
      case 'head down': {
        console.log(temp.vertical);
        if (temp.vertical > 15) {
          temp.headDown = true;
        }
        break;
      }
      case 'head up': {
        console.log(temp.vertical);
        if (temp.vertical < -15) {
          temp.headUp = true;
        }
        break;
      }
    }
  });

  temp.blink = temp.blinkLeft && temp.blinkRight;
  return temp;
}
