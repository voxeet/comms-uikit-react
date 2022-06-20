/* eslint-disable react/jsx-props-no-spreading */
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useEffect, useMemo, useRef } from 'react';

import useParticipants from '../../hooks/useParticipants';
import useTheme from '../../hooks/useTheme';
import useVideo from '../../hooks/useVideo';
import Avatar from '../Avatar/Avatar';
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
  const { isLocalVideoLoading } = useVideo();
  const { participantsStatus } = useParticipants();
  const { isLocal } = participantsStatus[participant.id] || {};

  const videoStream = useMemo(() => {
    return participant.streams[participant.streams.length - 1]?.getVideoTracks().length > 0;
  }, [participant]);

  useEffect(() => {
    if (videoRef?.current) {
      if (participant.streams?.length) {
        // @ts-expect-error bad navigator type
        navigator.attachMediaStream(videoRef.current, participant.streams[participant.streams.length - 1]);
      }
    }
  }, [participant]);

  const handleContent = useMemo(() => {
    if (isLocalVideoLoading && isLocal) {
      return (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      );
    }

    if (videoStream) {
      return (
        <video
          ref={videoRef}
          width={width || '100%'}
          height={height || 'auto'}
          muted
          autoPlay
          playsInline
          className={isMirrored ? styles.mirrored : ''}
        />
      );
    }
    return (
      <div className={styles.fallbackWrapper} data-testid="FallbackWrapper">
        {noVideoFallback || (
          <div className={styles.fallbackContent} data-testid="FallbackContent">
            <Avatar participant={participant} />
          </div>
        )}
      </div>
    );
  }, [videoStream, isLocalVideoLoading, isMirrored, isLocal]);

  return (
    <div
      className={styles.videoWrapper}
      data-testid={testID}
      style={{ backgroundColor: getColor('grey.700') }}
      {...props}
    >
      {handleContent}
    </div>
  );
};

export default VideoView;
