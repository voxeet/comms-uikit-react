import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import { ErrorCodes } from '../providers/CommsProvider';

import type { UseScreenSharing } from './types/ScreenShare';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const MAX_ALLOWED_SCREENSHARE = 2;

const useScreenSharing: UseScreenSharing = () => {
  const {
    startScreenShare,
    stopScreenShare,
    screenSharingData,
    setPendingTakeoverRequest,
    resetScreenSharingData,
    errors: { screenShareErrors: errorMessages },
    setContextErrors,
  } = useCommsContext();
  const { owners, status, isPendingTakeoverRequest, isPresentationModeActive } = screenSharingData;
  const { participant } = useSession();

  const handleStartScreenShare = async (takingOver?: boolean) => {
    if (owners.size >= MAX_ALLOWED_SCREENSHARE && !takingOver) {
      setContextErrors({ context: 'screenShareErrors', error: ErrorCodes.ScreenShareAlreadyInProgress });
      return false;
    }
    return startScreenShare();
  };

  const setSharingErrors = (error?: ErrorCodes) => {
    setContextErrors({ context: 'screenShareErrors', error });
  };

  function isLocalUserPresentationOwner(): boolean {
    if (participant === null) {
      return false;
    }

    return owners.get(participant) !== undefined;
  }

  function firstPresenter(): Participant | null {
    const p = owners.keys().next().value;

    if (p === undefined) {
      return null;
    }

    return p;
  }

  return {
    startScreenShare: handleStartScreenShare,
    stopScreenShare,
    owners,
    isLocalUserPresentationOwner: isLocalUserPresentationOwner(),
    firstPresenter: firstPresenter(),
    status,
    permissionError: !!errorMessages[ErrorCodes.PermissionDeniedBySystem],
    sharingInProgressError: !!errorMessages[ErrorCodes.ScreenShareAlreadyInProgress],
    setSharingErrors,
    isPendingTakeoverRequest,
    setPendingTakeoverRequest,
    resetScreenSharingData,
    isPresentationModeActive,
    isAutoStartShareError: !!errorMessages[ErrorCodes.ScreenShareAutoTakeoverError],
    isLackOfBrowserPermissions: !!errorMessages[ErrorCodes.LackOfBrowserPermissions],
  };
};

export default useScreenSharing;
