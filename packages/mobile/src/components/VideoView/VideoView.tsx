import { VideoView } from '@dolbyio/comms-sdk-react-native';
import type { Participant } from '@dolbyio/comms-sdk-react-native/lib/typescript/services/conference/models';
import React, { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';

import useTheme from '../../hooks/useTheme';

import styles from './VideoView.style';

type VideoProps = {
  participant: Participant;
  width: number | string;
  height: number | string;
  scaleType?: 'fill' | 'fit';
  noVideoFallback?: React.ReactNode;
};

const Video = ({ participant, width, height, scaleType, noVideoFallback }: VideoProps) => {
  const { colors, getColor } = useTheme();
  const videoView = useRef() as React.MutableRefObject<VideoView>;

  const videoStream = useMemo(() => {
    if (participant.streams) {
      return participant.streams[participant.streams.length - 1].videoTracks.length > 0;
    }
    return false;
  }, [participant]);

  useEffect(() => {
    if (videoView?.current) {
      if (participant.streams?.length) {
        videoView.current.attach(participant, participant.streams[participant.streams.length - 1]);
      }
    }
  }, [participant]);

  return (
    <View style={[styles.videoWrapper, { height, width: '100%' }]}>
      {videoStream ? (
        <VideoView ref={videoView} style={{ width, height }} scaleType={scaleType} />
      ) : (
        <View style={styles.fallbackWrapper}>
          {noVideoFallback || (
            <View style={[styles.fallbackContent, { backgroundColor: getColor(colors.infoInformation) }]} />
          )}
        </View>
      )}
    </View>
  );
};

export default Video;
