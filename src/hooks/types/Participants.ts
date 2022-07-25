import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export type ParticipantStatus = {
  /** Indicates if the participant has enabled camera. */
  isVideo: boolean;
  /** Indicates if the participant currently speaks. */
  isSpeaking: boolean;
  /** Indicates if the participant is local participant */
  isLocal: boolean;
  /** Indicates if the participant send audio to conference - is not muted. */
  isRemoteAudio: boolean;
  /** Indicates if the local participant receives audio from the participant. */
  isLocalAudio: boolean;
};

export type Participants = {
  /**
   * Local participant.
   */
  participant: Participant | null;
  /**
   * The list of conference participants.
   */
  participants: Participant[];

  /**
   * Lists of all the participants status.
   */
  participantsStatus: {
    [key: string]: ParticipantStatus;
  };

  /**
   * Checks if participant currently speaks.
   * @param participant -  Participant to check the status.
   */
  addIsSpeakingListener: (participant: Participant) => () => void;
};

export type UseParticipants = () => Participants;
