import { getNeedVideoWidth } from './human-helper';

export const getUserMedia = (
  width: number,
  height: number,
  videoMaxWidth: number,
  videoMaxHeight: number,
  isMobile: boolean
) => {
  if (navigator.mediaDevices) {
    const options = getNeedVideoWidth(width, height, videoMaxWidth, videoMaxHeight, isMobile);
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        ...options,
        facingMode: 'user'
      }
    });
  } else {
    return Promise.reject({ name: 'NotFoundError' });
  }
};
