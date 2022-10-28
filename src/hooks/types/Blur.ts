export type Blur = {
  /**
   * Informs if local users video is currently blurred.
   */
  isBlurred: boolean;
  /**
   * Starts video processing with blur.
   */
  startBackgroundBlur: () => void;
  /**
   * Removes video processor.
   */
  stopVideoProcessing: () => void;
};

export type UseBlur = () => Blur;
