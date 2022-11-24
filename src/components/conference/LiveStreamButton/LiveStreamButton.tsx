import { ReactNode, useEffect, useState } from 'react';

import { LiveStreamingMessages } from '../../../hooks/types/LiveStreaming';
import { Status, Status as LiveStreamingStatus } from '../../../hooks/types/misc';
import useLiveStreaming from '../../../hooks/useLiveStreaming';
import useMessage from '../../../hooks/useMessage';
import useTheme from '../../../hooks/useTheme';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type LiveStreamButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>> & {
  onStartLiveStreamingAction?: () => void;
  onStopLiveStreamingAction?: () => void;
  stopStreaming: () => Promise<void>;
  onError?: () => void;
  renderDataInput: (isVisible: boolean, close: () => void) => ReactNode;
  renderStopConfirmation?: (isVisible: boolean, accept: () => void, cancel: () => void) => ReactNode;
};

const LiveStreamButton = ({
  onStartLiveStreamingAction,
  onStopLiveStreamingAction,
  stopStreaming,
  renderDataInput,
  renderStopConfirmation,
  onError,
  badge = true,
  badgeColor = 'infoError',
  transparent = true,
  testID = 'LiveStreamButton',
  ...rest
}: LiveStreamButtonProps) => {
  const [isDataInputVisible, setIsDataInputVisible] = useState(false);
  const [isStopConfirmationVisible, setIsStopConfirmationVisible] = useState(false);
  const {
    isLiveStreamingModeActive,
    status,
    isLocalUserLiveStreamingOwner,
    isError,
    setLiveStreamingErrors,
    stopLiveStreaming,
  } = useLiveStreaming();
  const { message, clearMessage } = useMessage();
  const { isDesktop } = useTheme();

  useEffect(() => {
    if (message?.text === LiveStreamingMessages.STARTED) {
      onStartLiveStreamingAction?.();
      clearMessage();
    } else if (message?.text === LiveStreamingMessages.STOPPED) {
      onStopLiveStreamingAction?.();
      clearMessage();
    }
  }, [message]);

  const handleOnClick = () => {
    if (isLiveStreamingModeActive && status === Status.Active) {
      if (renderStopConfirmation) {
        setIsStopConfirmationVisible(true);
      } else {
        stopLiveStreaming(stopStreaming);
        onStopLiveStreamingAction?.();
      }
    } else {
      setIsDataInputVisible(true);
    }
  };

  const handleCloseDataInput = () => {
    setIsDataInputVisible(false);
  };

  const handleStopStreaming = async () => {
    setIsStopConfirmationVisible(false);
    stopLiveStreaming(stopStreaming);
  };

  const cancelStopOnConfirm = () => {
    setIsStopConfirmationVisible(false);
  };

  useEffect(() => {
    if (isError || status === LiveStreamingStatus.Error) {
      onError?.();
      setLiveStreamingErrors();
    }
  }, [isError, status]);

  return (
    <>
      <MediaButton
        transparent={transparent}
        defaultTooltipText={badge && isDesktop ? '' : rest.defaultTooltipText}
        activeTooltipText={badge && isDesktop ? '' : rest.activeTooltipText}
        defaultIcon="stream"
        activeIcon="stream"
        disabledIcon="stream"
        badge={badge && isDesktop && status === LiveStreamingStatus.Active}
        badgeColor={badgeColor}
        isDisabled={!isLocalUserLiveStreamingOwner && status === LiveStreamingStatus.Active}
        isActive={isLiveStreamingModeActive}
        onClick={handleOnClick}
        testID={testID}
        {...rest}
      />
      {renderDataInput && renderDataInput(isDataInputVisible, handleCloseDataInput)}
      {renderStopConfirmation &&
        renderStopConfirmation(isStopConfirmationVisible, handleStopStreaming, cancelStopOnConfirm)}
    </>
  );
};

export default LiveStreamButton;
