import { ErrorCodes } from '../providers/CommsProvider';

import type { UseScreenSharing } from './types/ScreenShare';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const useScreenSharing: UseScreenSharing = () => {
  const {
    startScreenShare,
    stopScreenShare,
    screenSharingData,
    setSharingErrors,
    setPendingTakeoverRequest,
    resetScreenSharingData,
    errors: { screenShareErrors: errorMessages },
  } = useCommsContext();
  const { owner, status, stream, isPendingTakeoverRequest, isPresentationModeActive } = screenSharingData;
  const { participant } = useSession();

  const handleStartScreenShare = async (takingOver?: boolean) => {
    if (stream && !takingOver) {
      setSharingErrors(ErrorCodes.ScreenShareAlreadyInProgress);
      return false;
    }
    return startScreenShare();
  };

  return {
    startScreenShare: handleStartScreenShare,
    stopScreenShare,
    stream,
    owner,
    isLocalUserPresentationOwner: owner?.id === participant?.id,
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
