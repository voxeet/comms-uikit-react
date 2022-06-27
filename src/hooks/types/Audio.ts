import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type Audio = {
  /**
   * Indicates audio state of local user.
   */
  isAudio: boolean;

  isLocalAudioLoading: boolean;
  
  /**
   * Toggles audio of local user.
   */
  toggleAudio: () => Promise<void>;
  
  resetAudio: () => void;
  
  /**
   * Starts receiving audio to local user from selected participant.
   */
  startParticipantAudio: (participant: Participant) => Promise<void>;
  
  /**
   * Stops receiving audio to local user from selected participant.
   */
  stopParticipantAudio: (participant: Participant) => Promise<void>;
}

export type UseAudio = () => Audio;
