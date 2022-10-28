import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import type { ErrorCodes } from '../../providers/CommsProvider';

import type { Status as ShareStatus } from './misc';

export type ScreenShare = {
  /**
   * Starts screen share. while starting via taking over- provide appropriate flag
   */
  startScreenShare: (takingOver?: boolean) => Promise<boolean>;

  /**
   * Stops screen share.
   */
  stopScreenShare: () => Promise<void>;

  /**
   * Participant which sharing screen.
   */
  owner: Participant | null;

  /**
   * Informs if local user is presentation owner.
   */
  isLocalUserPresentationOwner: boolean;

  /**
   * Stream object of current screen sharing.
   */
  stream: MediaStreamWithType | null;

  /**
   * Sharing stream current status.
   */
  status: ShareStatus;

  /**
   * Indicates if browser has no permission to screen share
   */
  permissionError: boolean;

  /**
   * Indicates if other user is presenting while trying to share
   */
  sharingInProgressError: boolean;

  /**
   * Function for resetting  errors  or adding specific error
   */
  setSharingErrors: (error?: ErrorCodes) => void;

  /**
   * Informs if local user has pending takeover request.
   */
  isPendingTakeoverRequest: boolean;

  /**
   * Changes pending takeover request status.
   */
  setPendingTakeoverRequest: (isPendingTakeoverRequest: boolean) => void;

  /**
   * Resets status of screen sharing for local user.
   */
  resetScreenShareStatus: () => void;

  /**
   * Informs if local user has active presentation mode.
   */
  isPresentationModeActive: boolean;

  /**
   * Informs if a browser problem with auto start screen share exists.
   */
  isAutoStartShareError: boolean;

  /**
   * Informs if there are not browser permissions to share screen.
   */
  isLackOfBrowserPermissions: boolean;
};

export type UseScreenSharing = () => ScreenShare;

export enum ScreenShareTakeoverMessages {
  REQUEST = 'TakeoverRequest',
  ACCEPT = 'TakeoverAccept',
  DECLINE = 'TakeoverDecline',
}
