/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from 'react';

import useCamera from '../../hooks/useCamera';
import { useIsMounted } from '../../hooks/useIsMounted';
import useMicrophone from '../../hooks/useMicrophone';
import useTheme from '../../hooks/useTheme';
import { IconIndicator, useSession } from '../../index';
import Avatar from '../Avatar/Avatar';

import styles from './VideoLocalView.module.scss';

export type VideoViewProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  width?: number;
  height?: number;
  noVideoFallback?: React.ReactNode;
  username?: string;
  device?: string | null;
  indicator?: boolean;
  audio?: boolean;
};

const VideoLocalView = ({
  testID,
  width = 712,
  height = 400,
  noVideoFallback,
  username,
  device,
  indicator = true,
  audio = true,
  ...props
}: VideoViewProps) => {
  const [videoSrcObject, setVideoSrcObject] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { getColor } = useTheme();
  const { user } = useSession();
  const { isVideo } = useCamera();
  const { isAudio, hasMicrophonePermission } = useMicrophone();
  const isMounted = useIsMounted();

  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);

  const checkMicrophonePermissions = (interval: NodeJS.Timer) => {
    (async () => {
      try {
        const hasMicrophoneAccess = await hasMicrophonePermission();
        setIsMicrophonePermission(hasMicrophoneAccess);
        if (hasMicrophoneAccess) {
          clearInterval(interval);
        }
      } catch {
        setIsMicrophonePermission(false);
      }
    })();
  };

  useEffect(() => {
    const interval: NodeJS.Timer = setInterval(() => checkMicrophonePermissions(interval), 500);
    return () => clearTimeout(interval);
  }, []);

  const clearVideoSrc = () => {
    videoSrcObject?.getTracks().forEach((track) => {
      track.stop();
    });
    setVideoSrcObject(null);
  };

  const attachStream = () => {
    const video: MediaStreamConstraints['video'] = {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    };
    if (device) {
      video.deviceId = { exact: device };
    }
    navigator.mediaDevices
      .getUserMedia({
        video,
        audio,
      })
      .then((stream) => {
        setVideoSrcObject(stream);
      })
      .catch(() => {
        clearVideoSrc();
      });
  };

  useEffect(() => {
    if (device) {
      clearVideoSrc();
      attachStream();
    }
  }, [device]);

  useEffect(() => {
    return () => {
      if (!isMounted()) {
        clearVideoSrc();
      }
    };
  }, [isMounted, videoSrcObject]);

  useEffect(() => {
    if (!isVideo) {
      clearVideoSrc();
    } else {
      attachStream();
    }
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
    <div
      className={styles.videoWrapper}
      data-testid={testID}
      style={{ backgroundColor: getColor('grey.700'), width, height }}
      {...props}
    >
      {videoSrcObject && isVideo ? (
        <video ref={videoRef} muted autoPlay playsInline width={width} height={height} />
      ) : (
        <div className={styles.fallbackWrapper} data-testid="FallbackWrapper">
          {noVideoFallback || (
            <div className={styles.fallbackContent} data-testid="FallbackContent">
              <Avatar participant={user || username} />
            </div>
          )}
        </div>
      )}
      {indicator && (
        <div className={styles.indicator}>
          <IconIndicator icon={isAudio && isMicrophonePermission ? 'microphone' : 'microphoneOff'} />
        </div>
      )}
    </div>
  );
};

export default VideoLocalView;
