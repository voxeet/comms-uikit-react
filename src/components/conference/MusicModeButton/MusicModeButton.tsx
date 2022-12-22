import { ReactNode, useEffect, useState } from 'react';

import { AudioCaptureMode, AudioProcessingMessages } from '../../../hooks/types/UseAudioProcessing';
import useAudio from '../../../hooks/useAudio';
import useAudioProcessing from '../../../hooks/useAudioProcessing';
import useMessage from '../../../hooks/useMessage';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type MusicModeButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>> & {
  onStartMusicModeAction?: () => void;
  onStopMusicModeAction?: () => void;
  onRemoteStartMusicModeAction?: (participantName: string) => void;
  renderStartConfirmation?: (isVisible: boolean, accept: () => void, cancel: () => void) => ReactNode;
  renderStopConfirmation?: (isVisible: boolean, accept: () => void, cancel: () => void) => ReactNode;
};

const MusicModeButton = ({
  onStartMusicModeAction,
  onStopMusicModeAction,
  onRemoteStartMusicModeAction,
  renderStartConfirmation,
  renderStopConfirmation,
  badge = true,
  badgeColor = 'primary.500',
  transparent = true,
  testID = 'MusicModeButton',
  ...rest
}: MusicModeButtonProps) => {
  const [isStartConfirmationVisible, setIsStartConfirmationVisible] = useState(false);
  const [isStopConfirmationVisible, setIsStopConfirmationVisible] = useState(false);

  const { isMusicMode, setAudioCaptureMode } = useAudioProcessing();
  const { sendMessage } = useMessage();
  const { isAudio } = useAudio();
  const { message, sender } = useMessage();

  useEffect(() => {
    if (message?.text === AudioProcessingMessages.MUSIC_MODE_STARTED && sender?.info.name) {
      onRemoteStartMusicModeAction?.(sender.info.name);
    }
  }, [message]);

  const startMusicMode = async () => {
    await setAudioCaptureMode({ mode: AudioCaptureMode.Music });
    const startMessage = {
      text: AudioProcessingMessages.MUSIC_MODE_STARTED,
    };
    sendMessage(startMessage);
  };

  const stopMusicMode = async () => {
    await setAudioCaptureMode({ mode: AudioCaptureMode.Standard });

    const stopMessage = {
      text: AudioProcessingMessages.MUSIC_MODE_STOPPED,
    };
    sendMessage(stopMessage);
  };

  const handleOnClick = () => {
    if (isMusicMode) {
      if (renderStopConfirmation) {
        setIsStopConfirmationVisible(true);
      } else {
        stopMusicMode();
        onStopMusicModeAction?.();
      }
    } else if (!isMusicMode) {
      if (renderStartConfirmation) {
        setIsStartConfirmationVisible(true);
      } else {
        startMusicMode();
        onStartMusicModeAction?.();
      }
    }
  };

  const handleStartMusicMode = () => {
    setIsStartConfirmationVisible(false);
    startMusicMode();
    onStartMusicModeAction?.();
  };

  const handleStopMusicMode = () => {
    setIsStopConfirmationVisible(false);
    stopMusicMode();
    onStopMusicModeAction?.();
  };

  const cancelStartOnConfirm = () => {
    setIsStartConfirmationVisible(false);
  };

  const cancelStopOnConfirm = () => {
    setIsStopConfirmationVisible(false);
  };

  return (
    <>
      <MediaButton
        transparent={transparent}
        defaultTooltipText={rest.defaultTooltipText}
        defaultIcon="tune"
        activeIcon="tune"
        disabledIcon="tune"
        badge={badge && isMusicMode}
        badgeColor={badgeColor}
        isActive={isMusicMode as boolean}
        onClick={handleOnClick}
        isDisabled={!isAudio}
        testID={testID}
        {...rest}
      />
      {renderStartConfirmation &&
        renderStartConfirmation(isStartConfirmationVisible, handleStartMusicMode, cancelStartOnConfirm)}
      {renderStopConfirmation &&
        renderStopConfirmation(isStopConfirmationVisible, handleStopMusicMode, cancelStopOnConfirm)}
    </>
  );
};

export default MusicModeButton;
