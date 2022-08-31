/* eslint-disable react/jsx-props-no-spreading */
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import useVideo from '../../../hooks/useVideo';
import { autoVideoScale } from '../../../utils/autoVideoScale.util';
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
  const { getColor, isDesktop, isMobileSmall, isMobile } = useTheme();
  const { isVideo } = useVideo();
  const { participantsStatus, participants } = useParticipants();
  const { isLocal } = participantsStatus[participant.id] || {};
  const [isLoading, setIsLoading] = useState(true);
  const [currentStream, setCurrentStream] = useState<MediaStreamWithType | null>(null);
  const [isUserFacingCamera, setIsUserFacingCamera] = useState(isMirrored);
  const [scale, setScale] = useState(1);

  const isSmartphone = isMobileSmall || isMobile;

  const videoStream = useMemo(() => {
    return participant.streams[participant.streams.length - 1]?.getVideoTracks().length > 0;
  }, [participant]);

  useEffect(() => {
    if (participant.streams?.length) {
      const stream = participant.streams[participant.streams.length - 1];
      const facingUserMode = stream.getVideoTracks()[0]?.getSettings()?.facingMode === 'user';
      setIsUserFacingCamera((isMirrored && isDesktop) || facingUserMode);
      setCurrentStream(participant.streams[participant.streams.length - 1]);
    }
  }, [participant]);

  useEffect(() => {
    if (videoRef?.current) {
      // @ts-expect-error bad navigator type
      navigator.attachMediaStream(videoRef.current, currentStream);
    } else {
      setIsLoading(true);
    }
  }, [currentStream]);

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

  const setVideoScale = () => {
    const scale = autoVideoScale(wrapperRef.current, videoRef.current, currentStream) || 1;
    setScale(scale);
  };

  useEffect(() => {
    videoRef.current?.addEventListener('resize', () => {
      setTimeout(() => {
        setVideoScale();
      }, 100);
    });
  }, [currentStream]);

  useEffect(() => {
    setVideoScale();
  }, [participants.length, isMobileSmall, isMobile, isDesktop]);

  const avatarSize = useMemo(() => {
    if (isSmartphone) {
      return 'm';
    }
    if (participants.length <= 6) {
      return 'l';
    }
    return 'm';
  }, [participants]);

  return (
    <div
      className={cx(styles.videoWrapper, { [styles.desktop]: isDesktop })}
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
          className={cx({ [styles.mirrored]: isUserFacingCamera, [styles.isLoading]: isLoading })}
          onLoadedData={handleLoadedVideo}
          style={{
            transform: `translate(-50%, -50%) scale(${!isUserFacingCamera ? '' : '-'}${scale}, ${scale})`,
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
