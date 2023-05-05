export type RealTimeStreaming = {
  /**
   * Indicate if the conference is live streaming
   */
  isLive: boolean;

  /**
   * Start real time streaming
   * Note: this function depends on proxy server implementation
   */
  startRealTimeStreaming: () => Promise<void>;

  /**
   * Stop real time streaming
   * Note: this function depends on proxy server implementation
   */
  stopRealTimeStreaming: () => Promise<void>;
};

/**
 * RealTimeStreaming hook
 * Note: this hook only work with proxy server, please check the implementation of dolby.io demo server
 *@param proxyBaseUrl the base URL of proxy server
 */
export type UseRealTimeStreaming = (proxyBaseUrl: string) => RealTimeStreaming;
