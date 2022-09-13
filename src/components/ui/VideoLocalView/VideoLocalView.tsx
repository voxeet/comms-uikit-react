/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line import/no-extraneous-dependencies
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import useAudio from '../../../hooks/useAudio';
import useCamera from '../../../hooks/useCamera';
import useTheme from '../../../hooks/useTheme';
import useVideo from '../../../hooks/useVideo';
import { throwErrorMessage } from '../../../utils/throwError.util';
import { useIsMounted } from '../../../utils/useIsMounted';
import LocalAvatar from '../../conference/LocalAvatar/LocalAvatar';
import IconIndicator from '../indicators/IconIndicator/IconIndicator';
import Space from '../Space/Space';

import styles from './VideoLocalView.module.scss';

export type VideoViewProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  width?: number;
  height?: number;
  noVideoFallback?: React.ReactNode;
  username?: string;
  indicator?: boolean;
  cameraReverseButton?: boolean;
  audio?: boolean;
  disabled?: boolean;
  isMicrophonePermission?: boolean;
};

enum FacingModes {
  Env = 'environment',
  User = 'user',
}

const VideoLocalView = ({
  testID,
  width = 712,
  height = 400,
  noVideoFallback,
  username,
  indicator = true,
  audio = true,
  cameraReverseButton = true,
  disabled = false,
  isMicrophonePermission,
  ...props
}: VideoViewProps) => {
  const [videoSrcObject, setVideoSrcObject] = useState<MediaStream | null>(null);
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
  const [isUsingRearCamera, setIsUsingRearCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getColor, isDesktop, isTablet } = useTheme();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { localCamera, swapCamera, getCameraPermission } = useCamera();

  const prevIsVideo = useRef<boolean>();

  const isMounted = useIsMounted();

  const clearVideoSrc = () => {
    videoStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
    if (videoSrcObject) {
      videoSrcObject.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoSrcObject(null);
    }
  };

  const attachStream = async () => {
    await getCameraPermission();
    const video: MediaStreamConstraints['video'] = {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    };
    if (localCamera) {
      video.deviceId = { exact: localCamera.deviceId };
    }
    if (audio) {
      navigator.mediaDevices
        .getUserMedia({
          audio,
        })
        .then((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        });
    }
    if (isVideo) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video,
        })
        .then((stream) => {
          if (!isDesktop) {
            const { facingMode } = stream.getTracks()[0].getCapabilities();
            if (facingMode?.[0] === FacingModes.Env) {
              setIsUsingRearCamera(true);
            } else {
              setIsUsingRearCamera(false);
            }
          }
          setVideoSrcObject(stream);
          setVideoStreams((prev) => [...prev, stream]);
        })
        .catch((error) => {
          throwErrorMessage(error);
          clearVideoSrc();
        });
    }
  };

  useEffect(() => {
    clearVideoSrc();
    if (localCamera) {
      attachStream();
    }
  }, [localCamera, disabled]);

  useEffect(() => {
    return () => {
      if (!isMounted()) {
        clearVideoSrc();
      }
    };
  }, [isMounted, videoSrcObject, disabled]);

  useEffect(() => {
    if (prevIsVideo.current === false && isVideo) {
      clearVideoSrc();
      attachStream();
    }
    if (!isVideo) {
      clearVideoSrc();
    }
  }, [isVideo, disabled]);

  useEffect(() => {
    prevIsVideo.current = isVideo;
  }, [isVideo]);

  useEffect(() => {
    if (videoRef?.current) {
      if (videoSrcObject) {
        videoRef.current.srcObject = videoSrcObject;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [videoSrcObject]);

  const reverseCamera = async () => {
    await swapCamera();
  };

  const handleDoubleClick = async () => {
    if (!isDesktop) {
      await reverseCamera();
    }
  };

  const isBigAvatar = isTablet || isDesktop;

  return (
    <Space
      onDoubleClick={handleDoubleClick}
      className={cx(styles.videoWrapper, !isDesktop && styles.mobile)}
      testID={testID}
      style={{ backgroundColor: getColor('grey.700'), width, height }}
      {...props}
    >
      {videoSrcObject && isVideo && !disabled ? (
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          width={width}
          height={height}
          className={cx({ [styles.rearCamera]: isUsingRearCamera })}
        />
      ) : (
        <Space fw fh className={styles.fallbackWrapper} testID="FallbackWrapper">
          {noVideoFallback || (
            <Space fh className={styles.fallbackContent} testID="FallbackContent">
              <LocalAvatar size={isBigAvatar ? 'l' : 'm'} testID="LocalAvatar" username={username} />
            </Space>
          )}
        </Space>
      )}
      {indicator && (
        <Space className={styles.indicator}>
          <IconIndicator icon={isAudio && isMicrophonePermission ? 'microphone' : 'microphoneOff'} />
        </Space>
      )}
      {cameraReverseButton && !isDesktop && isVideo && !disabled && (
        <Space onClick={reverseCamera} className={styles.cameraReverse}>
          <IconIndicator icon="cameraReverse" />
        </Space>
      )}
    </Space>
  );
};

export default React.memo(VideoLocalView);
