/*
 * Public API Surface of face-detection
 */

export * from './lib/face-detection.module';
export * from './lib/face-detection.interface';
export { FaceDetectionComponent } from './lib/face-detection.component';
export { FaceDetectionService } from './lib/face-detection.service';
export { getConfig } from './lib/get-config';
export { NGX_FACE_DETECTION, LivenessActionResult } from './lib/face-detection.interface';
export { getNeedVideoWidth } from './lib/human-helper';
export { createHuman, IHuman } from './lib/human-helper';
export { getUserMedia } from './lib/get-user-media';
export { groupFace } from './lib/takephoto.util';
