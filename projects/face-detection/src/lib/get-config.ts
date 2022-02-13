import { Config } from '@vladmandic/human';

export interface IHumanConfig {
  resourcesUrl?: string;
  live?: boolean;
  iris?: boolean;
  debug?: boolean;
}

// todo: wasmPlatformFetch not exist in Config,later remove any
export const getConfig = (opts?: IHumanConfig): Config | any => {
  const resourcesUrl = opts?.resourcesUrl ? opts?.resourcesUrl : '../models/';
  const live = opts?.live ? opts?.live : false;
  const iris = opts?.iris ? opts?.iris : false;
  const debug = opts?.debug ? opts?.debug : false;
  return {
    backend: 'webgl',
    modelBasePath: resourcesUrl,
    cacheModels: true,
    wasmPath: 'human/assets/',
    wasmPlatformFetch: false,
    debug: debug,
    async: true,
    warmup: 'face',
    cacheSensitivity: 0.70,
    skipAllowed: false,
    deallocate: false,
    filter: {
      enabled: true,
      equalization: false,
      width: 0,
      height: 0,
      flip: false,
      return: true,
      brightness: 0,
      contrast: 0,
      sharpness: 0,
      blur: 0,
      saturation: 0,
      hue: 0,
      negative: false,
      sepia: false,
      vintage: false,
      kodachrome: false,
      technicolor: false,
      polaroid: false,
      pixelate: 0,
    },
    gesture: {
      enabled: true,
    },
    face: {
      enabled: true,
      detector: {
        modelPath: 'human/models/blazeface.json',
        rotation: true,
        maxDetected: 1,
        skipFrames: 99,
        skipTime: 2500,
        minConfidence: 0.2,
        iouThreshold: 0.1,
        mask: false,
        return: false,
      },
      mesh: {
        enabled: live,
        modelPath: 'human/models/facemesh.json',
      },
      iris: {
        enabled: live && iris,
        modelPath: 'human/models/iris.json'
      },
      emotion: {
        enabled: false,
        minConfidence: 0.1,
        skipFrames: 99,
        skipTime: 1500,
        modelPath: 'human/models/emotion.json' // can be 'mini', 'larg'
      },
      description: {
        enabled: true,
        modelPath: 'human/models/faceres.json',
        skipFrames: 99,
        skipTime: 3e3,
        minConfidence: 0.1
      },
      antispoof: {
        enabled: false,
        skipFrames: 99,
        skipTime: 4e3,
        modelPath: 'human/models/antispoof.json'
      },
      liveness: {
        enabled: false,
        skipFrames: 99,
        skipTime: 4e3,
        modelPath: 'human/models/liveness.json'
      }
    },

    body: {
      enabled: false,
      modelPath: 'human/models/movenet-lightning.json',
      maxDetected: -1,
      minConfidence: 0.3,
      skipFrames: 1,
      skipTime: 200
    },

    hand: {
      enabled: false,
      rotation: false,
      skipFrames: 15, // how many frames to go without re-running the hand bounding box detector
      skipTime: 1e3,
      // only used for video inputs
      // e.g., if model is running st 25 FPS, we can re-use existing bounding
      // box for updated hand skeleton analysis as the hand probably
      // hasn't moved much in short time (10 * 1/25 = 0.25 sec)
      minConfidence: 0.5, // threshold for discarding a prediction
      iouThreshold: 0.1, // threshold for deciding whether boxes overlap too much
      // in non-maximum suppression
      // score in non-maximum suppression
      maxDetected: -1, // maximum number of hands detected in the input
      // should be set to the minimum number for performance
      landmarks: true, // detect hand landmarks or just hand boundary box
      detector: {
        modelPath: 'human/models/handtrack.json'
      },
      skeleton: {
        modelPath: 'human/models/handlandmark-full.json'
      }
    },

    object: {
      enabled: false,
      modelPath: 'human/models/mb3-centernet.json',
      minConfidence: 0.2,
      iouThreshold: 0.4,
      maxDetected: 10,
      skipFrames: 99,
      skipTime: 2e3
    },
    segmentation: {
      enabled: false,
      modelPath: 'human/models/selfie.json',
      blur: 8
    }
  }
};
