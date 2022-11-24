import { useMemo, ReactNode, useState, useEffect } from 'react';

import { Status as ShareStatus } from '../../../hooks/types/misc';
import { ScreenShareTakeoverMessages } from '../../../hooks/types/ScreenShare';
import useMessage from '../../../hooks/useMessage';
import useScreenSharing from '../../../hooks/useScreenSharing';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type ScreenShareButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>> & {
  onStopSharingAction?: () => void;
  onStartSharingAction?: () => void;
  onTakeOverDeclineAction?: () => void;
  onLackOfBrowserPermissions?: () => void;
  renderTakeOver?: (isVisible: boolean, resetError: () => void) => ReactNode;
  renderHandOver?: (isVisible: boolean, accept: () => void, cancel: () => void, participant?: string) => ReactNode;
  renderAskForShare?: (isVisible: boolean, accept: () => void, cancel: () => void) => ReactNode;
};

const ScreenShareButton = ({
  size = 'm',
  onStopSharingAction,
  onStartSharingAction,
  onTakeOverDeclineAction,
  onLackOfBrowserPermissions,
  tooltipPosition = 'top',
  defaultIcon = 'present',
  activeIcon = 'present',
  disabledIcon = 'present',
  renderTakeOver,
  renderHandOver,
  renderAskForShare,
  testID = 'ScreenShareButton',
  ...rest
}: ScreenShareButtonProps) => {
  const [isTakeoverRequestVisible, setIsTakeoverRequestVisible] = useState(false);
  const [isAskForShareTooltipVisible, setIsAskForShareTooltipVisible] = useState(false);

  const {
    startScreenShare,
    stopScreenShare,
    status,
    isLocalUserPresentationOwner,
    setSharingErrors,
    sharingInProgressError,
    isPendingTakeoverRequest,
    setPendingTakeoverRequest,
    stream,
    isAutoStartShareError,
    isLackOfBrowserPermissions,
  } = useScreenSharing();

  const { message, sender, sendMessage, clearMessage } = useMessage();

  const showTakeoverRequestTooltip = async () => {
    if (
      status === ShareStatus.Active &&
      isLocalUserPresentationOwner &&
      message?.text === ScreenShareTakeoverMessages.REQUEST
    ) {
      setIsTakeoverRequestVisible(true);
    }
  };

  const showAskForShareTooltip = () => {
    if (isAutoStartShareError) {
      setIsAskForShareTooltipVisible(true);
    } else {
      setIsAskForShareTooltipVisible(false);
    }
  };

  const acceptStartShare = async () => {
    if (isLackOfBrowserPermissions) {
      onLackOfBrowserPermissions?.();
      setIsAskForShareTooltipVisible(false);
    } else {
      setIsAskForShareTooltipVisible(false);
      await startScreenShare();
    }
  };

  const cancelStartShare = () => {
    setSharingErrors();
    setIsAskForShareTooltipVisible(false);
  };

  const acceptHandOverRequest = async () => {
    await stopScreenShare();
    await sendMessage({
      text: ScreenShareTakeoverMessages.ACCEPT,
    });
    onStopSharingAction?.();
    clearMessage();
    setIsTakeoverRequestVisible(false);
  };

  const declineHandOverRequest = async () => {
    await sendMessage({
      text: ScreenShareTakeoverMessages.DECLINE,
    });
    clearMessage();
    setIsTakeoverRequestVisible(false);
  };

  const handleTakeoverPresentationResponse = async () => {
    if (isPendingTakeoverRequest) {
      if (message?.text === ScreenShareTakeoverMessages.ACCEPT) {
        if (status === ShareStatus.Other) {
          setPendingTakeoverRequest(false);
          if (isLackOfBrowserPermissions) {
            onLackOfBrowserPermissions?.();
          } else {
            const result = await startScreenShare();
            if (result) {
              onStartSharingAction?.();
            }
          }
        }
      } else if (message?.text === ScreenShareTakeoverMessages.DECLINE) {
        onTakeOverDeclineAction?.();
        setPendingTakeoverRequest(false);
        clearMessage();
      }
    }
  };

  const toggleScreenShare = async () => {
    if (status === ShareStatus.Active && isLocalUserPresentationOwner) {
      await stopScreenShare();
      onStopSharingAction?.();
    } else {
      const result = await startScreenShare();
      if (result) {
        onStartSharingAction?.();
      }
    }
  };

  const isButtonActive = useMemo(() => {
    let isActive;

    if (status === ShareStatus.Active) {
      isActive = isLocalUserPresentationOwner;
    } else {
      isActive = false;
    }

    return isActive;
  }, [isLocalUserPresentationOwner, status]);

  const clearError = () => {
    setSharingErrors();
  };

  const handleLackOfBrowserPermissions = () => {
    if (isLackOfBrowserPermissions) {
      onLackOfBrowserPermissions?.();
    }
  };

  useEffect(() => {
    showTakeoverRequestTooltip();
    handleTakeoverPresentationResponse();
    showAskForShareTooltip();
    handleLackOfBrowserPermissions();
  }, [isLocalUserPresentationOwner, status, message, isAutoStartShareError, isLackOfBrowserPermissions, stream]);

  return (
    <>
      <MediaButton
        tooltipPosition={tooltipPosition}
        defaultIcon={defaultIcon}
        activeIcon={activeIcon}
        disabledIcon={disabledIcon}
        isActive={isButtonActive}
        isDisabled={isPendingTakeoverRequest}
        onClick={toggleScreenShare}
        size={size}
        testID={testID}
        {...rest}
      />
      {renderTakeOver && renderTakeOver(sharingInProgressError, clearError)}
      {renderHandOver &&
        renderHandOver(isTakeoverRequestVisible, acceptHandOverRequest, declineHandOverRequest, sender?.info.name)}
      {renderAskForShare && renderAskForShare(isAskForShareTooltipVisible, acceptStartShare, cancelStartShare)}
    </>
  );
};

export default ScreenShareButton;
