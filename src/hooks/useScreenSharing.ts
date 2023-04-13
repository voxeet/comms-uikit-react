import { ErrorCodes } from '../providers/CommsProvider';

import type { UseScreenSharing } from './types/ScreenShare';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

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
  const { owner, status, stream, isPendingTakeoverRequest, isPresentationModeActive } = screenSharingData;
  const { participant } = useSession();

  const handleStartScreenShare = async (takingOver?: boolean) => {
    if (stream && !takingOver) {
      setContextErrors({ context: 'screenShareErrors', error: ErrorCodes.ScreenShareAlreadyInProgress });
      return false;
    }
    return startScreenShare();
  };

  const setSharingErrors = (error?: ErrorCodes) => {
    setContextErrors({ context: 'screenShareErrors', error });
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
