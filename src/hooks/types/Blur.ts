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
  /**
   * Informs if blur is supported by environment.
   */
  isSupported: boolean | null;
};

export type UseBlur = () => Blur;
