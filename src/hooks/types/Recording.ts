import type { ErrorCodes } from '../../providers/CommsProvider';

import type { Status as RecordingStatus } from './misc';

export type Recording = {
  /**
   * Starts recording.
   */
  startRecording: () => Promise<boolean>;

  /**
   * Stops recording.
   */
  stopRecording: () => Promise<boolean>;

  /**
   * ID of the participant who is recording.
   */
  ownerId: string | null;

  /**
   * The number of seconds from the start of recording.
   */
  timestamp: number | null;

  /**
   * Informs if local user is recording owner.
   */
  isLocalUserRecordingOwner: boolean;

  /**
   * Status of the recording.
   */
  status: RecordingStatus;

  /**
   * Function for resetting  errors  or adding specific error.
   */
  setRecordingErrors: (error?: ErrorCodes) => void;

  /**
   * Resets recording data for local user.
   */
  resetRecordingData: () => void;

  /**
   * Informs if local user has active recording mode.
   */
  isRecordingModeActive: boolean;

  /**
   * Informs if some error exists in recording.
   */
  isError: boolean;
};

export type UseRecording = () => Recording;
