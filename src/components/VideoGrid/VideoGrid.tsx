/* eslint-disable react/jsx-props-no-spreading */
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import useTheme from '../../hooks/useTheme';
import { fitInHeight, FitInHeightOptions } from '../../utils/fitInHeight.util';
import Text from '../Text/Text';

import styles from './VideoGrid.module.scss';

type VideoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participants: Participant[];
  gap?: number;
  minWidth?: number;
  maxColumns?: number;
  maxTiles?: number;
  renderItem: (participant: Participant) => ReactNode;
  renderMaxTile?: (participants: Participant[]) => ReactNode;
};

const MIN_WIDTH = 300;

const VideoGrid = ({
  testID,
  participants,
  gap = 8,
  maxColumns = 4,
  maxTiles = 24,
  minWidth = MIN_WIDTH,
  renderItem,
  renderMaxTile,
  ...props
}: VideoGridProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { getColor } = useTheme();
  const [width, setWidth] = useState(minWidth);

  const handleSetWidth = (value: number) => {
    setWidth(value > minWidth ? value : minWidth);
  };

  const [tiles, restTiles] = useMemo(() => {
    if (maxTiles !== undefined) {
      const first = participants.slice(0, maxTiles - 1);
      const last = participants.slice(maxTiles - 1);
      if (last.length === 1) {
        return [[...first, ...last], []];
      }
      return [first, last];
    }
    return [participants, []];
  }, [participants]);

  const tileWidth = () => {
    if (wrapperRef.current) {
      const { clientWidth, clientHeight } = wrapperRef.current;
      const options: FitInHeightOptions = {
        minWidth,
        clientWidth,
        clientHeight,
        gap,
      };
      if (tiles.length < 4) {
        options.clientWidth = clientWidth / participants.length;
      } else if (tiles.length === 4) {
        options.clientWidth = clientWidth / 2;
        options.rows = 2;
      } else if (tiles.length <= 9) {
        options.clientWidth = clientWidth / 3;
        options.rows = 3;
      } else {
        options.clientWidth = clientWidth / maxColumns;
      }
      handleSetWidth(fitInHeight(options).width);
    }
  };

  const containerWidth = useMemo(() => {
    if (tiles.length === 4) {
      return 2 * width + gap * 2;
    }
    if (tiles.length < 10) {
      return 3 * width + gap * 3;
    }
    return '100%';
  }, [width, maxColumns]);

  useEffect(() => {
    tileWidth();
    window.addEventListener('resize', tileWidth);
    return () => window.removeEventListener('resize', tileWidth);
  }, [participants.length, maxColumns]);

  if (participants.length === 0) {
    return null;
  }

  return (
    <div data-testid={testID} ref={wrapperRef} className={styles.wrapper} style={{ margin: `0 -${gap}px` }} {...props}>
      <div className={styles.content} style={tiles.length === 1 ? undefined : { width: containerWidth }}>
        {tiles.map((p) => (
          <div
            className={styles.videoItem}
            key={`${p.id}-${p.streams[p.streams.length - 1]?.getVideoTracks()[0]?.id}`}
            style={{ minWidth: `${minWidth}px`, width: `${width}px`, padding: tiles.length === 1 ? 0 : `${gap}px` }}
          >
            {renderItem(p)}
          </div>
        ))}
        {restTiles.length > 0 && (
          <div
            className={styles.maxTile}
            style={{ minWidth: `${minWidth}px`, width: `${width}px`, padding: `${gap}px` }}
          >
            <div className={styles.maxTileWrapper}>
              {renderMaxTile ? (
                renderMaxTile(restTiles)
              ) : (
                <div className={styles.maxTileContent} style={{ backgroundColor: getColor('grey.700') }}>
                  <Text type="H0">
                    <span>+</span>
                    {restTiles.length}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
