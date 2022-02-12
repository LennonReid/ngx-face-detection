/**
 * take a photo when detected faces
 */
export const takefacePhoto = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  needWidth: number,
  needHeight: number,
  faceRect: { x: number; y: number; width: number; height: number }
) => {
  const ctx = canvas.getContext('2d');
  const { x, y, width, height } = faceRect;

  canvas.width = needWidth;
  canvas.height = needHeight;

  const b1 = needWidth / needHeight;
  const b2 = width / height;

  let nw: number = width;
  let nh: number = height;

  if (b1 > b2) {
    nw = nh * b1;
  } else {
    nh = nw / b1;
  }
  // enlarge the frame of face
  const ex = 1.3;
  nw *= ex;
  nh *= ex;
  let px = x - (nw - width) / 2;
  let py = y - (nh - height) / 2 - height * 0.1;
  // Guarantees that the offset x y is within the canvas
  px = px < 0 ? 0 : px;
  py = py < 0 ? 0 : py;
  // handle when the right border overrun
  const rx = px + nw;
  if (rx > video.videoWidth) {
    px -= rx - video.videoWidth;
  }
  // handle when the bottom border overrun
  const by = py + nh;
  if (by > video.videoHeight) {
    py -= by - video.videoHeight;
  }
  if (ctx) {
    // Fill it with black
    ctx.fillRect(0, 0, needWidth, needHeight);
    // make it smoothing
    ctx.imageSmoothingEnabled = true;
    // TODO: delete try after update
    try {
      ctx['imageSmoothingQuality'] = 'high';
    } catch (error) {
      //
    }

    ctx.scale(-1, 1);
    // draw videos
    ctx.drawImage(video, px, py, nw, nh, -needWidth, 0, needWidth, needHeight);
  }
  return canvas.toDataURL('image/jpeg', 0.85);
};

// return a screenshot from videos by detected range
export const takePhotoWithRect = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  faceRect: { x: number; y: number; width: number; height: number }
) => {
  const vWidth = video.videoWidth;
  const nWidth = video.clientWidth;
  const rectPhoto = canvas.getContext('2d');
  const bl = vWidth / nWidth;
  const x = (1 - (faceRect.x + faceRect.width) / nWidth) * vWidth;
  let y = faceRect.y;
  const w = (faceRect.width / nWidth) * vWidth;
  const h = (w * faceRect.height) / faceRect.width;
  if (nWidth > vWidth) {
    y = faceRect.y * bl;
  }
  canvas.width = w;
  canvas.height = h;
  if (rectPhoto) {
    rectPhoto.clearRect(0, 0, w, h);
    rectPhoto.scale(-1, 1);
    rectPhoto.drawImage(video, x, y, w, h, -w, 0, w, h);
  }

  return canvas.toDataURL('image/jpeg', 0.85);
};

// take a photo from videos
export const takeVideoPhoto = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const rectPhoto = canvas.getContext('2d');
  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  if (rectPhoto) {
    rectPhoto.clearRect(0, 0, w, h);
    rectPhoto.scale(-1, 1);
    rectPhoto.drawImage(video, 0, 0, w, h, -w, 0, w, h);
  }
  return canvas.toDataURL('image/jpeg', 0.85);
};
