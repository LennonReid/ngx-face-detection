export interface IHumanFaceResult {
  age?: number;
  annotations: {
    silhouette: number[][];
    lipsUpperOuter: number[][];
    lipsLowerOuter: number[][];
    lipsUpperInner: number[][];
    lipsLowerInner: number[][];
    rightEyeUpper0: number[][];
    rightEyeLower0: number[][];
    rightEyeUpper1: number[][];
    rightEyeLower1: number[][];
    rightEyeUpper2: number[][];
    rightEyeLower2: number[][];
    rightEyeLower3: number[][];
    rightEyebrowUpper: number[][];
    rightEyebrowLower: number[][];
    rightEyeIris: number[][];
    leftEyeUpper0: number[][];
    leftEyeLower0: number[][];
    leftEyeUpper1: number[][];
    leftEyeLower1: number[][];
    leftEyeUpper2: number[][];
    leftEyeLower2: number[][];
    leftEyeLower3: number[][];
    leftEyebrowUpper: number[][];
    leftEyebrowLower: number[][];
    leftEyeIris: number[][];
    midwayBetweenEyes: number[][];
    noseTip: number[][];
    noseBottom: number[][];
    noseRightCorner: number[][];
    noseLeftCorner: number[][];
    rightCheek: number[][];
    leftCheek: number[][];
  };
  box: number[];
  confidence: number;
  embedding: any;
  emotion: any;
  gender?: string;
  genderConfidence?: any;
  iris: number;
  mesh: number[][];
  withinRect?: boolean;
  gesture: string[];
}

export interface IFaceGesture {
  face: number;
  gesture: string;
}

export interface IHumanResult {
  body: any[];
  canvas: { width: number; height: number };
  face: IHumanFaceResult[];
  gesture: IFaceGesture[];
  hand: any[];
  performance: {
    cacheCheck: number;
    cachedFrames: number;
    initBackend: number;
    inputProcess: number;
    loadModels: number;
    total: number;
    totalFrames: number
  };
}
