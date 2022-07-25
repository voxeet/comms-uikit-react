/* eslint-disable react/jsx-props-no-spreading */
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import useVideo from '../../../hooks/useVideo';
import LocalAvatar from '../../conference/LocalAvatar/LocalAvatar';
import ParticipantAvatar from '../../conference/ParticipantAvatar/ParticipantAvatar';
import Space from '../Space/Space';
import Spinner from '../Spinner/Spinner';

import styles from './VideoView.module.scss';

export type VideoViewProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participant: Participant;
  width?: number | string;
  height?: number | string;
  noVideoFallback?: React.ReactNode;
  isMirrored?: boolean;
};

const VideoView = ({
  testID,
  participant,
  width,
  height,
  noVideoFallback,
  isMirrored = false,
  ...props
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getColor } = useTheme();
  const { isVideo } = useVideo();
  const { participantsStatus } = useParticipants();
  const { isLocal } = participantsStatus[participant.id] || {};
  const [isLoading, setIsLoading] = useState(true);
  const [currentStream, setCurrentStream] = useState<MediaStreamWithType | null>(null);

  const videoStream = useMemo(() => {
    return participant.streams[participant.streams.length - 1]?.getVideoTracks().length > 0;
  }, [participant]);

  useEffect(() => {
    if (participant.streams?.length) {
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

  return (
    <div
      className={styles.videoWrapper}
      data-testid={testID}
      style={{ backgroundColor: getColor('grey.700') }}
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
          className={cx({ [styles.mirrored]: isMirrored, [styles.isLoading]: isLoading })}
          onLoadedData={handleLoadedVideo}
        />
      ) : (
        <div className={styles.fallbackWrapper} data-testid="FallbackWrapper">
          {noVideoFallback || (
            <div className={styles.fallbackContent} data-testid="FallbackContent">
              {isLocal ? (
                <LocalAvatar testID="LocalAvatar" />
              ) : (
                <ParticipantAvatar testID="ParticipantAvatar" participant={participant} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoView);
