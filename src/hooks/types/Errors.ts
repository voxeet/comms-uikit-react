import type { Errors as ErrorsType, ErrorCodes, ErrorParams } from '../../providers/CommsProvider';

export type Errors = {
  /**
   * Errors related to sdkErrors.
   */
  sdkErrors: ErrorsType['sdkErrors'];

  /**
   * Errors related to screenSharing.
   */
  screenShareErrors: ErrorsType['screenShareErrors'];

  /**
   * Errors related to videocall recording.
   */
  recordingErrors: ErrorsType['recordingErrors'];

  /**
   * Removes all current SDK errors.
   */
  removeSdkErrors: (error?: ErrorCodes) => void;
  /**
   * For debugging purposes - use this handler to populate error or artificially set error for messaging purposes
   */
  setErrorsExplicitly: (params: ErrorParams) => void;
};

export type UseErrors = () => Errors;
