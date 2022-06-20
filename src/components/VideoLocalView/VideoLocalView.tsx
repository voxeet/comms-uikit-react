/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from 'react';

import useAudio from '../../hooks/useAudio';
import useMicrophone from '../../hooks/useMicrophone';
import useSession from '../../hooks/useSession';
import useTheme from '../../hooks/useTheme';
import useVideo from '../../hooks/useVideo';
import { useIsMounted } from '../../utils/useIsMounted';
import Avatar from '../Avatar/Avatar';
import IconIndicator from '../indicators/IconIndicator/IconIndicator';

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
  let interval: NodeJS.Timer | null = null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const { getColor } = useTheme();
  const { user } = useSession();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { hasMicrophonePermission } = useMicrophone();
  const isMounted = useIsMounted();
  const prevIsVideo = useRef<boolean>();

  const [isMicrophonePermission, setIsMicrophonePermission] = useState<boolean>(false);

  const checkMicrophonePermissions = () => {
    (async () => {
      try {
        const hasMicrophoneAccess = await hasMicrophonePermission();
        setIsMicrophonePermission(hasMicrophoneAccess);
        if (hasMicrophoneAccess && interval) {
          clearInterval(interval);
        }
      } catch {
        setIsMicrophonePermission(false);
      }
    })();
  };

  useEffect(() => {
    interval = setInterval(() => checkMicrophonePermissions(), 500);
    return () => {
      if (interval) {
        clearTimeout(interval);
      }
    };
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
    navigator.mediaDevices
      .getUserMedia({
        video,
      })
      .then((stream) => {
        clearVideoSrc();
        setVideoSrcObject(stream);
      })
      .catch(() => {
        clearVideoSrc();
      });
  };

  useEffect(() => {
    clearVideoSrc();
    attachStream();
  }, [device]);

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
