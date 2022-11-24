import { useEffect, useState } from 'react';

import useCamera from '../../../hooks/useCamera';
import useSession from '../../../hooks/useSession';
import useVideo from '../../../hooks/useVideo';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type LocalToggleVideoButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>>;

const LocalToggleVideoButton = ({
  size = 'm',
  tooltipPosition = 'top',
  defaultIcon = 'camera',
  activeIcon = 'cameraOff',
  disabledIcon = 'cameraOff',
  testID = 'LocalToggleVideoButton',
  ...rest
}: LocalToggleVideoButtonProps) => {
  const { getCameraPermission } = useCamera();
  const { isVideo, toggleVideo } = useVideo();
  const { participant } = useSession();

  const [isCameraPermission, setIsCameraPermission] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hasAccess = await getCameraPermission();
        setIsCameraPermission(hasAccess);
      } catch {
        setIsCameraPermission(false);
      }
    })();
  }, []);

  return (
    <MediaButton
      tooltipPosition={tooltipPosition}
      defaultIcon={defaultIcon}
      activeIcon={activeIcon}
      disabledIcon={disabledIcon}
      isActive={!isVideo}
      isDisabled={!isCameraPermission || !participant}
      onClick={toggleVideo}
      size={size}
      testID={testID}
      {...rest}
    />
  );
};

export default LocalToggleVideoButton;
