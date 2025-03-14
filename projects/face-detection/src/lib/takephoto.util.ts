import { std } from 'mathjs';
import { IHumanResult } from './human.interface';
// Group comparisons as needed
export const groupFace = (faces: IHumanResult[]) => {
  const newArr: number[][] = [];
  faces?.forEach((face) => {
    const arr: number[] = [];
    face?.face.forEach((faceChild) => {
      arr.push(faceChild.box[0]);
      arr.push(faceChild.box[1]);
    });
    newArr.push(arr);
  });
  return handleFaces(newArr);
};

// Calculate matrix variance and 80 is ok
export const handleFaces = (faces: number[][]): number => {
  return Number(std(faces)[0]);
};
