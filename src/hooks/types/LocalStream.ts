export type LocalStream = {
  /**
   * Local user stream.
   */
  localStream: MediaStream | null;

  /**
   * Set stream for local user.
   */
  setLocalStream: (stream?: MediaStream) => void;
};

export type UseLocalStream = () => LocalStream;
