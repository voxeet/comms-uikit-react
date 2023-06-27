/* eslint-disable no-console */
/* eslint-disable jsx-a11y/media-has-caption */

import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import React, { useRef, useEffect, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';
import Spinner from '../Spinner/Spinner';

import styles from './PresentationBox.module.scss';

export type PresentationBoxProps = {
  children?: React.ReactNode;
  stream?: MediaStreamWithType | null;
  fallbackContent: React.ReactNode;
  isError?: boolean;
  isLocalUserPresentationOwner?: boolean;
  backgroundColor?: ColorKey;
  style?: React.CSSProperties;
  testID?: string;
};

const PresentationBox = ({
  children,
  stream,
  fallbackContent,
  isError = false,
  isLocalUserPresentationOwner,
  backgroundColor = 'grey.800',
  style,
  testID,
}: PresentationBoxProps) => {
  const { getColor, isDesktop } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else {
      setIsLoading(false);
    }
  }, [stream]);

  return (
    <Space
      fw={isDesktop}
      fh={isDesktop}
      testID={testID}
      className={styles.container}
      style={{ backgroundColor: getColor(backgroundColor), ...style }}
    >
      <video
        onLoadedData={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
      {children && <Space className={styles.pill}>{children}</Space>}
      {isError && isLocalUserPresentationOwner && fallbackContent}
      {isLoading && (
        <Space fw fh className={styles.spinnerWrapper}>
          <Spinner />
        </Space>
      )}
    </Space>
  );
};

export default PresentationBox;
