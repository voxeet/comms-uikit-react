import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';

export const autoVideoScale = (
  container: HTMLDivElement | null,
  video: HTMLVideoElement | null,
  currentStream: MediaStreamWithType | null,
) => {
  const { width = 1, height = 1 } = currentStream?.getVideoTracks()[0]?.getSettings?.() || {};
  const isPortraitVideo = width < height;
  if (container !== null && video !== null) {
    const { clientWidth: cw, clientHeight: ch } = container;
    const { clientWidth: vw, clientHeight: vh } = video;
    if (isPortraitVideo) {
      let scale = 0.5;
      while (vh * scale <= ch + 10) {
        scale += 0.1;
      }
      return scale;
    }
    let scale = 1.1;
    while (vw * scale < cw || vh * scale < ch) {
      scale += 0.1;
    }
    return Math.min(scale, 1.4);
  }
  return undefined;
};
