import { LivenessActionMap, LivenessActionResult, LivenessActions } from './face-detection.interface';

// Calculate variance
export const variance = (numbers: number[]) => {
  let mean = 0;
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  mean = sum / numbers.length;
  sum = 0;
  for (let j = 0; j < numbers.length; j++) {
    sum += Math.pow(numbers[j] - mean, 2);
  }
  return sum / numbers.length;
};

/**
 * By judging the appearance and disappearance distance of the action
 */
export const isFacingActionByDistance = (
  needArr: Array<keyof LivenessActionMap>,
  left: keyof LivenessActionMap,
  right: keyof LivenessActionMap,
  distance = 10,
  index = 0
): any => {
  const leftIndex = needArr.indexOf(left, index);
  if (leftIndex >= 0) {
    const rightIndex = needArr.indexOf(right, leftIndex);
    if (rightIndex !== -1) {
      const fitDistance = rightIndex - leftIndex <= distance;
      if (fitDistance) {
        return true;
      }
      if (rightIndex < needArr.length - 1) {
        return isFacingActionByDistance(needArr, left, right, distance, rightIndex);
      }
    }
  }
  return false;
};

/**
 * Determine whether an action is included directly
 */
const isFacingAction = (needArr: boolean[]) => {
  return needArr.indexOf(true) !== -1;
};

/**
 * Judge if some actions is included
 */
const isFacingActions = (stageResults: LivenessActionMap[], key: keyof LivenessActionMap) => {
  const needArr: any[] = [];
  stageResults.forEach((stageResult: LivenessActionMap) => {
    const value = !!stageResult[key];
    let last = false;
    if (needArr.length > 0) {
      last = needArr[needArr.length - 1];
    }
    if (last !== value) {
      needArr.push(value);
    }
  });
  return isFacingAction(needArr);
};

/**
 * filter out actions
 */
export const filterActions = (
  results: LivenessActionMap[],
  actions: Array<keyof LivenessActionMap>
): Array<keyof LivenessActionMap> => {
  const needArr: any[] = [];
  let lastAction: keyof LivenessActionMap;
  results.forEach((stageResult: LivenessActionMap) => {
    let hasValue = false;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const value = stageResult[action];
      if (value) {
        hasValue = true;
        if (lastAction !== action) {
          needArr.push(action);
          lastAction = action;
        }
        break;
      }
    }
    if (!hasValue) {
      needArr.push(undefined);
    }
  });
  return needArr;
};

const isShake = (result: LivenessActionMap[]) => {
  const newActions = filterActions(result, ['facingLeft', 'facingRight']);
  console.log(newActions);
  return (
    isFacingActionByDistance(newActions, 'facingLeft', 'facingRight', 4) ||
    isFacingActionByDistance(newActions, 'facingRight', 'facingLeft', 4)
  );
};

export const hasLivenessAction = (result: LivenessActionResult[], aciton: LivenessActions) => {
  switch (aciton) {
    case 'facingLeft':
    case 'facingRight':
      return isFacingActions(result, aciton) && variance(result.map(r => r.horizontal)) > 50;
    case 'headUp':
    case 'headDown':
      return isFacingActions(result, aciton) && variance(result.map(r => r.vertical)) > 100;
    case 'mouth':
    case 'facingCamera':
      return isFacingActions(result, aciton);
    case 'blink':
      return result.findIndex(r => r.blink) > -1;
    case 'shake':
      return isShake(result);
    default:
      break;
  }
  return false;
};
