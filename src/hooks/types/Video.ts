export type Video = {
  /**
   * Indicates video state of local user.
   */
  isVideo: boolean;

  isLocalVideoLoading: boolean;

  /**
   * Toggles video of local user.
   */
  toggleVideo: () => Promise<void>;

  resetVideo: () => void;
}

export type UseVideo = () => Video;
