import type { ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type Session = {
  /**
   * The object of the local participant in a session.
   */
  participant: Participant | null;

  /**
   * Opens a new Dolby.io session.
   * @param participantInfo - The information about the local participant.
   */
  openSession: (participantInfo: ParticipantInfo) => Promise<void>;

  /**
   * Closes the current Dolby.io session.
   */
  closeSession: () => Promise<void>;

  /**
   * Gets the version of the SDK.
   * @returns the version of the SDK.
   */
  getSDKVersion: () => string;
};

export type UseSession = () => Session;
