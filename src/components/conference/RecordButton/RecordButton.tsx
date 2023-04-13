import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Status as RecordingStatus } from '../../../hooks/types/misc';
import useRecording from '../../../hooks/useRecording';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type RecordButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive'>> & {
  onStopRecordingAction?: () => void;
  onStartRecordingAction?: () => void;
  onError?: () => void;
  renderStartConfirmation?: (isVisible: boolean, acept: () => void, cancel: () => void) => ReactNode;
  renderStopConfirmation?: (isVisible: boolean, accept: () => void, cancel: () => void) => ReactNode;
};

const RecordButton = ({
  isDisabled,
  size = 'm',
  onStopRecordingAction,
  onStartRecordingAction,
  onError,
  tooltipPosition = 'top',
  defaultIcon = 'record',
  activeIcon = 'record',
  disabledIcon = 'record',
  renderStartConfirmation,
  renderStopConfirmation,
  testID = 'RecordButton',
  ...rest
}: RecordButtonProps) => {
  const [isStartConfirmationVisible, setIsStartConfirmationVisible] = useState(false);
  const [isStopConfirmationVisible, setIsStopConfirmationVisible] = useState(false);

  const {
    startRecording,
    stopRecording,
    status,
    isLocalUserRecordingOwner,
    isError,
    setRecordingErrors,
    isRecordingModeActive,
  } = useRecording();

  const handleToggleRecording = useCallback(async () => {
    if (status === RecordingStatus.Active && isLocalUserRecordingOwner) {
      if (renderStopConfirmation) {
        setIsStopConfirmationVisible(true);
      } else {
        handleStopRecording();
      }
    } else if (status === RecordingStatus.Other) {
      if (renderStartConfirmation) {
        setIsStartConfirmationVisible(true);
      } else {
        handleStartRecording();
      }
    }
  }, [status, isLocalUserRecordingOwner, isStopConfirmationVisible, isStartConfirmationVisible]);

  const handleStartRecording = async () => {
    setIsStartConfirmationVisible(false);
    const result = await startRecording();
    if (result) {
      onStartRecordingAction?.();
    }
  };

  const cancelRecordingOnConfirm = () => {
    setIsStartConfirmationVisible(false);
  };

  const handleStopRecording = async () => {
    setIsStopConfirmationVisible(false);
    const result = await stopRecording();
    if (result) {
      onStopRecordingAction?.();
    }
  };

  const cancelStopOnConfirm = () => {
    setIsStopConfirmationVisible(false);
  };

  useEffect(() => {
    if (isError || status === RecordingStatus.Error) {
      onError?.();
      setRecordingErrors();
    }
  }, [isError, status]);

  const isButtonActive = useMemo(() => {
    let isActive;

    if (status === RecordingStatus.Active || isRecordingModeActive) {
      isActive = isLocalUserRecordingOwner;
    } else {
      isActive = false;
    }

    return isActive;
  }, [isLocalUserRecordingOwner, status, isRecordingModeActive]);

  return (
    <>
      <MediaButton
        tooltipPosition={tooltipPosition}
        defaultIcon={defaultIcon}
        activeIcon={activeIcon}
        disabledIcon={disabledIcon}
        isActive={isButtonActive}
        isDisabled={isDisabled || (status === RecordingStatus.Active && !isLocalUserRecordingOwner)}
        onClick={handleToggleRecording}
        size={size}
        testID={testID}
        {...rest}
      />
      {renderStartConfirmation &&
        renderStartConfirmation(isStartConfirmationVisible, handleStartRecording, cancelRecordingOnConfirm)}
      {renderStopConfirmation &&
        renderStopConfirmation(isStopConfirmationVisible, handleStopRecording, cancelStopOnConfirm)}
    </>
  );
};

export default RecordButton;
