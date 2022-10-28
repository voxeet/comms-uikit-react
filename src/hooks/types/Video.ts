import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type Video = {
  /**
   * Indicates video state of local user.
   */
  isVideo: boolean;

  /**
   * Toggles video of local user.
   */
  toggleVideo: () => Promise<void>;

  resetVideo: () => void;

  startRemoteParticipantVideo: (participant: Participant) => Promise<void>;
  stopRemoteParticipantVideo: (participant: Participant) => Promise<void>;
};

export type UseVideo = () => Video;
