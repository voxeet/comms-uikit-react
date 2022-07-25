/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';

import useAudio from '../../../hooks/useAudio';
import useMicrophone from '../../../hooks/useMicrophone';
import useSession from '../../../hooks/useSession';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type LocalToggleAudioButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>>;

const LocalToggleAudioButton = ({
  size = 'm',
  tooltipPosition = 'top',
  activeIcon = 'microphone',
  inactiveIcon = 'microphoneOff',
  disabledIcon = 'microphoneOff',
  testID = 'LocalToggleAudioButton',
  ...rest
}: LocalToggleAudioButtonProps) => {
  const { getMicrophonePermission } = useMicrophone();
  const { isAudio, toggleAudio } = useAudio();
  const { participant } = useSession();

  const [isMicrophonePermission, setIsMicrophonePermission] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hasAccess = await getMicrophonePermission();
        setIsMicrophonePermission(hasAccess);
      } catch {
        setIsMicrophonePermission(false);
      }
    })();
  }, []);

  return (
    <MediaButton
      tooltipPosition={tooltipPosition}
      activeIcon={activeIcon}
      inactiveIcon={inactiveIcon}
      disabledIcon={disabledIcon}
      isActive={isAudio}
      isDisabled={!isMicrophonePermission || !participant}
      onClick={toggleAudio}
      size={size}
      testID={testID}
      {...rest}
    />
  );
};

export default LocalToggleAudioButton;
