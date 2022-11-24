/* eslint-disable react/jsx-props-no-spreading */
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import React, { useEffect, useMemo, useRef, useState, CSSProperties } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import useVideo from '../../../hooks/useVideo';
import LocalAvatar from '../../conference/LocalAvatar/LocalAvatar';
import ParticipantAvatar from '../../conference/ParticipantAvatar/ParticipantAvatar';
import Space from '../Space/Space';
import Spinner from '../Spinner/Spinner';

import styles from './VideoTile.module.scss';

export type VideoTileProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participant: Participant;
  width?: number | string;
  height?: number | string;
  noVideoFallback?: React.ReactNode;
  isMirrored?: boolean;
};

const VideoTile = ({ testID, participant, width, height, noVideoFallback, isMirrored, ...props }: VideoTileProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getColor, isMobileSmall, isMobile } = useTheme();
  const { isVideo, toggleVideo } = useVideo();
  const { participantsStatus, participants } = useParticipants();
  const { isLocal } = participantsStatus[participant.id] || {};
  const [isLoading, setIsLoading] = useState(true);
  const [currentStream, setCurrentStream] = useState<MediaStreamWithType | null>(null);
  const [isMirrorStream, setIsMirrorStream] = useState(isMirrored);
  const [isPiPEnabled, setIsPiPEnabled] = useState(false);

  const isSmartphone = isMobileSmall || isMobile;

  const videoStream = useMemo(() => {
    const cameraStreams = participant.streams.filter((stream) => stream.type !== 'ScreenShare');
    return cameraStreams[cameraStreams.length - 1]?.getVideoTracks().length > 0;
  }, [participant]);

  useEffect(() => {
    if (participant.streams?.length) {
      const cameraStreams = participant.streams.filter((stream) => stream.type !== 'ScreenShare');
      const stream = cameraStreams[cameraStreams.length - 1];
      const facingMode = stream?.getVideoTracks()[0]?.getSettings()?.facingMode;
      const facingUserMode = facingMode === 'user';
      setIsMirrorStream(facingMode ? facingUserMode : isMirrored);
      setCurrentStream(cameraStreams[cameraStreams.length - 1]);
    }
  }, [participant]);

  useEffect(() => {
    if (videoRef?.current && currentStream) {
      // @ts-expect-error bad navigator type
      navigator.attachMediaStream(videoRef.current, currentStream);
      /*
       * Below effect is applied due problem with muted stream track while sending camera stream from iOS device
       * ( this is connected with trusted events and gesture handlers)
       * Until problem will be resolved on SDK side , we need to stick to this workaround
       * SDK 3.6 behaves properly
       */
      if (currentStream?.getVideoTracks()?.[0]?.muted && isVideo && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        (async () => {
          await toggleVideo();
          await toggleVideo();
        })();
      }
    } else {
      setIsLoading(true);
    }
  }, [currentStream, participant]);

  useEffect(() => {
    if (!document.pictureInPictureEnabled || !videoRef.current) return;
    videoRef.current.addEventListener('enterpictureinpicture', () => {
      setIsPiPEnabled(true);
    });
    videoRef.current.addEventListener('leavepictureinpicture', () => {
      setIsPiPEnabled(false);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      videoRef.current?.removeEventListener('enterpictureinpicture', () => {
        setIsPiPEnabled(true);
      });
      videoRef.current?.removeEventListener('leavepictureinpicture', () => {
        setIsPiPEnabled(false);
      });
    };
  }, []);

  const handleLoadedVideo = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleLoader = () => {
    if ((isLocal || isLoading) && isVideo) {
      return (
        <Space className={styles.spinnerWrapper}>
          <Spinner />
        </Space>
      );
    }
    return null;
  };

  const isPortraitVideo = () => {
    const { width = 1, height = 1 } = currentStream?.getVideoTracks()[0]?.getSettings?.() || {};
    return width < height;
  };

  const avatarSize = useMemo(() => {
    if (isSmartphone) {
      return 'm';
    }
    if (participants.length <= 6) {
      return 'l';
    }
    return 'm';
  }, [participants]);

  const objectFitStyles = () => {
    const styles: CSSProperties = {};
    const isPortrait = isPortraitVideo();
    if (isPortrait || !isLocal) {
      styles.width = '100%';
      styles.height = '100%';
    }
    if (isPortrait) {
      styles.objectFit = 'contain';
    } else if (!isLocal) {
      styles.objectFit = 'cover';
    }
    return styles;
  };

  return (
    <div
      className={cx(styles.videoWrapper)}
      data-testid={testID}
      style={{ backgroundColor: getColor('grey.700') }}
      ref={wrapperRef}
      {...props}
    >
      {handleLoader()}
      {videoStream ? (
        <video
          ref={videoRef}
          data-testid={`${testID}-video`}
          width={width || '100%'}
          height={height || 'auto'}
          muted
          autoPlay
          playsInline
          className={cx({ [styles.isLoading]: isLoading })}
          onLoadedData={handleLoadedVideo}
          style={{
            transform: `translate(-50%, -50%) scale(${!isMirrorStream || isPiPEnabled ? '' : '-'}1, 1)`,
            ...objectFitStyles(),
          }}
        />
      ) : (
        <div className={styles.fallbackWrapper} data-testid="FallbackWrapper">
          {noVideoFallback || (
            <div className={styles.fallbackContent} data-testid="FallbackContent">
              {isLocal ? (
                <LocalAvatar testID="LocalAvatar" size={avatarSize} />
              ) : (
                <ParticipantAvatar testID="ParticipantAvatar" participant={participant} size={avatarSize} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoTile);
