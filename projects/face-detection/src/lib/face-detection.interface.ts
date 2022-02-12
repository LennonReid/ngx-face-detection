import { InjectionToken } from '@angular/core';

export interface FaceRect {
  x: number; // 方形左上角点 x
  y: number; // 方形左上角点 y
  width?: number; // 方形宽度
  height?: number; // 方形高度
  minScore?: number; // 最小得分 0-1
}


export interface IFaceDetectionOptions {
  script: string;
  resourcesUrl: string;
  production?: boolean;
}


export const NGX_FACE_DETECTION = new InjectionToken<IFaceDetectionOptions>('NGX_FACE_DETECTION');

export interface LivenessActionMap {
  facingLeft?: boolean;
  facingRight?: boolean;
  facingCamera?: boolean;
  blinkLeft?: boolean;
  blinkRight?: boolean;
  blink?: boolean;
  mouth?: boolean;
  headUp?: boolean;
  headDown?: boolean;
}

export interface LivenessActionResult extends LivenessActionMap {
  vertical: number;
  horizontal: number;
}

export type LivenessActions =
  | 'facingLeft'
  | 'facingRight'
  | 'facingCamera'
  | 'blink'
  | 'mouth'
  | 'headUp'
  | 'headDown'
  | 'shake';

export interface Filter {
  enabled: boolean;
  equalization: boolean;
  width: number;
  height: number;
  flip: boolean;
  return: boolean;
  brightness: number;
  contrast: number;
  sharpness: number;
  blur: number;
  saturation: number;
  hue: number;
  negative: boolean;
  sepia: boolean;
  vintage: boolean;
  kodachrome: boolean;
  technicolor: boolean;
  polaroid: boolean;
  pixelate: number;
}

export interface Gesture {
  enabled: boolean;
}

export interface Detector {
  modelPath: string;
  rotation: boolean;
  maxDetected: number;
  skipFrames: number;
  skipTime: number;
  minConfidence: number;
  iouThreshold: number;
  mask: boolean;
  return: boolean;
}

export interface Mesh {
  enabled: boolean;
  modelPath: string;
}

export interface Iris {
  enabled: boolean;
  modelPath: string;
}

export interface Emotion {
  enabled: boolean;
  minConfidence: number;
  skipFrames: number;
  skipTime: number;
  modelPath: string;
}

export interface Description {
  enabled: boolean;
  modelPath: string;
  skipFrames: number;
  skipTime: number;
  minConfidence: number;
}

export interface Antispoof {
  enabled: boolean;
  skipFrames: number;
  skipTime: number;
  modelPath: string;
}

export interface Liveness {
  enabled: boolean;
  skipFrames: number;
  skipTime: number;
  modelPath: string;
}

export interface Face {
  enabled: boolean;
  detector: Detector;
  mesh: Mesh;
  iris: Iris;
  emotion: Emotion;
  description: Description;
  antispoof: Antispoof;
  liveness: Liveness;
}

export interface Body {
  enabled: boolean;
  modelPath: string;
  maxDetected: number;
  minConfidence: number;
  skipFrames: number;
  skipTime: number;
}

export interface Detector2 {
  modelPath: string;
}

export interface Skeleton {
  modelPath: string;
}

export interface Hand {
  enabled: boolean;
  rotation: boolean;
  skipFrames: number;
  skipTime: number;
  minConfidence: number;
  iouThreshold: number;
  maxDetected: number;
  landmarks: boolean;
  detector: Detector2;
  skeleton: Skeleton;
}


