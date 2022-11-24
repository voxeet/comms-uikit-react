import { useMemo } from 'react';

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
    screenShareErrorMessages: errorMessages,
    setPendingTakeoverRequest,
    resetScreenSharingData,
  } = useCommsContext();
  const { owner, status, stream, isPendingTakeoverRequest, isPresentationModeActive } = screenSharingData;
  const { participant } = useSession();

  const isLocalUserPresentationOwner = useMemo(() => {
    return owner?.id === participant?.id;
  }, [owner, participant]);

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
    isLocalUserPresentationOwner,
    status,
    permissionError: errorMessages.some((error) => error === ErrorCodes.PermissionDeniedBySystem),
    sharingInProgressError: errorMessages.some((error) => error === ErrorCodes.ScreenShareAlreadyInProgress),
    setSharingErrors,
    isPendingTakeoverRequest,
    setPendingTakeoverRequest,
    resetScreenSharingData,
    isPresentationModeActive,
    isAutoStartShareError: errorMessages.some((error) => error === ErrorCodes.ScreenShareAutoTakeoverError),
    isLackOfBrowserPermissions: errorMessages.some((error) => error === ErrorCodes.LackOfBrowserPermissions),
  };
};

export default useScreenSharing;
