import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export enum BlockedAudioState {
  INACTIVATED = 'inactivated',
  ACTIVATED = 'activated',
  ENABLED = 'enabled',
}

export type Audio = {
  /**
   * Indicates audio state of local user.
   */
  isAudio: boolean;

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
  /**
   *
   * Enables receive audio from conference participants if user joins as listener on Safari browser.
   */
  playBlockedAudio: () => Promise<void>;
  /**
   *
   * Check if Safari user enabled blocked audio. States "inactivated" and "activated" are connected with used browser and permissions.
   */
  blockedAudioState: BlockedAudioState;
  /**
   *
   * Sets blockedAudioState as enabled if Safari user enable remote audio.
   */
  markBlockedAudioEnabled: () => void;
  /**
   *
   * Sets blockedAudioState as activated, it helps user to show some pop up with allow audio request withoud adding separated flag.
   */
  markBlockedAudioActivated: () => void;
  /**
   *
   * Starting / stopping receiving all participants audio.
   */
  toggleMuteParticipants: () => void;
  /**
   *
   * Indicates status of page sound mute.
   */
  isPageMuted: boolean;
};

export type UseAudio = () => Audio;
