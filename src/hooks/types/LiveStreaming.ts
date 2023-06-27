import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import type { ErrorCodes } from '../../providers/CommsProvider';

import type { Status } from './misc';

export type LiveStreamProvider = 'youtube' | 'facebook' | 'twitch' | null;

export type LiveStreaming = {
  /**
   * Starts live-streaming.
   */
  startLiveStreaming: (start: () => Promise<void>, rtmp: string, provider: LiveStreamProvider) => Promise<boolean>;

  /**
   * Stops live-streaming.
   */
  stopLiveStreaming: (stop: () => Promise<void>) => Promise<boolean>;

  /**
   * Participant who is live-streaming.
   */
  owner: Participant | null;

  /**
   * Timestamp when the live-streaming started.
   */
  timestamp: number | null;

  /**
   * Informs if local user is live-streaming owner.
   */
  isLocalUserLiveStreamingOwner: boolean;

  /**
   * Status of the live-streaming.
   */
  status: Status;

  /**
   * Resets live-streaming data for local user.
   */
  resetLiveStreamingData: () => void;

  /**
   * Informs if local user has active live-streaming mode.
   */
  isLiveStreamingModeActive: boolean;

  /**
   * Informs where user is live-streaming, if it can be determined from rtmp url
   */
  provider: LiveStreamProvider;
  /**
   * Storing value for accessing current live-streaming api
   */
  rtmp?: string;

  /**
   * Function for resetting  errors  or adding specific error.
   */
  setLiveStreamingErrors: (error?: ErrorCodes) => void;

  /**
   * Informs if some error exists in live streaming.
   */
  isError: boolean;

  /**
   * A handy function to start live streaming using proxy server
   * Note: please don't use this function if your own proxy server implementation
   * is different with the dolby.io demo proxy server, instead please use `startLiveStreaming`
   * @param baseUrl the base URL of the proxy server to start live streaming
   * @param rtmpUrl RTMP url
   * @returns true means operation success, false means failure
   */
  startLiveStreamingByProxy: (baseUrl: string, rtmpUrl: string) => Promise<boolean>;

  /**
   * A handy function to stop live streaming using proxy server
   * Note: please don't use this function if your own proxy server implementation
   * is different with the dolby.io demo proxy server, instead please use `stopLiveStreaming`
   * @param baseUrl the base URL of the proxy server to stop live streaming
   * @returns true means operation success, false means failure
   */
  stopLiveStreamingByProxy: (baseUrl: string) => Promise<boolean>;

  /**
   * While refreshing the page with the live stream active we need to inform backend about
   * this by sending beacon to stop the streaming
   * @param baseUrl the base URL of the proxy server to stop live streaming
   */
  sendStreamingBeacon: (baseUrl: string) => void;
};

export type UseLiveStreaming = () => LiveStreaming;

export enum LiveStreamingMessages {
  STARTED = 'Live streaming started',
  STOPPED = 'Live streaming stopped',
}
