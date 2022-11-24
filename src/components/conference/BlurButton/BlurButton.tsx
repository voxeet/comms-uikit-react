import { useEffect, useRef } from 'react';

import useBlur from '../../../hooks/useBlur';
import useVideo from '../../../hooks/useVideo';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type BlurButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>>;

const BlurButton = ({
  size = 'm',
  tooltipPosition = 'top',
  defaultIcon = 'backgroundBlur',
  activeIcon = 'backgroundBlur',
  disabledIcon = 'backgroundBlur',
  testID = 'BlurButton',
  ...rest
}: BlurButtonProps) => {
  const { startBackgroundBlur, stopVideoProcessing, isBlurred } = useBlur();
  const { isVideo } = useVideo();
  const prevIsVideo = useRef<boolean>();

  useEffect(() => {
    if (prevIsVideo.current === false && isVideo && isBlurred) {
      startBackgroundBlur();
    }
  }, [isVideo, isBlurred]);

  useEffect(() => {
    prevIsVideo.current = isVideo;
  }, [isVideo]);

  const handleBlur = () => {
    if (isVideo) {
      if (!isBlurred) {
        startBackgroundBlur();
      } else {
        stopVideoProcessing();
      }
    }
  };
  // background blur is supported only on DESKTOP Chrome and Edge
  if (
    (navigator.userAgent.match(/chrome|chromium/i) || navigator.userAgent.match(/edg/i)) &&
    navigator.userAgent.indexOf('Mobile') === -1
  ) {
    return (
      <MediaButton
        tooltipPosition={tooltipPosition}
        defaultIcon={defaultIcon}
        activeIcon={activeIcon}
        disabledIcon={disabledIcon}
        isActive={isBlurred}
        isDisabled={!isVideo}
        onClick={handleBlur}
        size={size}
        testID={testID}
        {...rest}
      />
    );
  }
  return null;
};

export default BlurButton;
