/* eslint-disable react/jsx-props-no-spreading */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useEffect, useRef, useState } from 'react';

import useAudio from '../../../hooks/useAudio';
import useCamera from '../../../hooks/useCamera';
import useMicrophone from '../../../hooks/useMicrophone';
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
  audio?: boolean;
};

const VideoLocalView = ({
  testID,
  width = 712,
  height = 400,
  noVideoFallback,
  username,
  indicator = true,
  audio = true,
  ...props
}: VideoViewProps) => {
  const [videoSrcObject, setVideoSrcObject] = useState<MediaStream | null>(null);
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { getColor } = useTheme();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { getMicrophonePermission } = useMicrophone();
  const { localCamera } = useCamera();
  const isMounted = useIsMounted();
  const prevIsVideo = useRef<boolean>();

  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);

  const checkMicrophonePermissions = () => {
    (async () => {
      try {
        const hasMicrophoneAccess = await getMicrophonePermission();
        setIsMicrophonePermission(hasMicrophoneAccess);
      } catch {
        setIsMicrophonePermission(false);
      }
    })();
  };

  useEffect(() => {
    checkMicrophonePermissions();
  }, []);

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

  const attachStream = () => {
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
    attachStream();
  }, [localCamera]);

  useEffect(() => {
    return () => {
      if (!isMounted()) {
        clearVideoSrc();
      }
    };
  }, [isMounted, videoSrcObject]);

  useEffect(() => {
    if (prevIsVideo.current === false && isVideo) {
      clearVideoSrc();
      attachStream();
    }
    if (!isVideo) {
      clearVideoSrc();
    }
  }, [isVideo]);

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
  }, [videoRef, videoSrcObject]);

  return (
    <Space
      className={styles.videoWrapper}
      testID={testID}
      style={{ backgroundColor: getColor('grey.700'), width, height }}
      {...props}
    >
      {videoSrcObject && isVideo ? (
        <video ref={videoRef} muted autoPlay playsInline width={width} height={height} />
      ) : (
        <Space fw fh className={styles.fallbackWrapper} testID="FallbackWrapper">
          {noVideoFallback || (
            <Space fh className={styles.fallbackContent} testID="FallbackContent">
              <LocalAvatar testID="LocalAvatar" username={username} />
            </Space>
          )}
        </Space>
      )}
      {indicator && (
        <Space className={styles.indicator}>
          <IconIndicator icon={isAudio && isMicrophonePermission ? 'microphone' : 'microphoneOff'} />
        </Space>
      )}
    </Space>
  );
};

export default VideoLocalView;
