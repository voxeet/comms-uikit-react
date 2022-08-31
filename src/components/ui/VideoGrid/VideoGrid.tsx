/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import { fitInHeight, FitInHeightOptions } from '../../../utils/fitInHeight.util';
import HiddenVideoTile from '../HiddenVideoTile/HiddenVideoTile';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './VideoGrid.module.scss';

type VideoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participants: Participant[];
  gap?: number;
  minWidth?: number;
  maxColumns?: number;
  maxTiles?: number;
  localParticipant?: boolean;
  renderItem: (participant: Participant) => ReactNode;
  renderMaxTile?: (participants: Participant[]) => ReactNode;
};

const MIN_WIDTH = 220;

const MOBILE_SMALL = 'mobile-small';
const MOBILE = 'mobile';
const TABLET = 'tablet';
const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';

const TILES_MAP: Record<string, Record<string, Record<number, string[][]>>> = {
  [MOBILE_SMALL]: {
    [PORTRAIT]: {
      1: [['100%']],
      2: [['100%'], ['100%']],
      3: [['100%'], ['50%', '50%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [['50%', '50%'], ['50%', '50%'], ['50%']],
      6: [
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
      ],
    },
    [LANDSCAPE]: {
      1: [['100%']],
      2: [['50%', '50%']],
      3: [['33.333%', '33.333%', '33.333%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%'],
      ],
      6: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
      ],
    },
  },
  [MOBILE]: {
    [PORTRAIT]: {
      1: [['100%']],
      2: [['100%'], ['100%']],
      3: [['100%'], ['50%', '50%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [['50%', '50%'], ['50%', '50%'], ['50%']],
      6: [
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      7: [['50%', '50%'], ['50%', '50%'], ['50%', '50%'], ['50%']],
      8: [
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
      ],
    },
    [LANDSCAPE]: {
      1: [['100%']],
      2: [['50%', '50%']],
      3: [['33.333%', '33.333%', '33.333%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%'],
      ],
      6: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
      ],
      7: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%'],
      ],
      8: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
      ],
    },
  },
  [TABLET]: {
    [PORTRAIT]: {
      1: [['100%']],
      2: [['100%'], ['100%']],
      3: [['100%'], ['50%', '50%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [['50%', '50%'], ['50%', '50%'], ['66%']],
      6: [
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      7: [['50%', '50%'], ['50%', '50%'], ['50%', '50%'], ['66%']],
      8: [
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      9: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
      ],
      10: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['50%'],
      ],
      11: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%'],
      ],
      12: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
      ],
    },
    [LANDSCAPE]: {
      1: [['100%']],
      2: [['50%', '50%']],
      3: [['33.333%', '33.333%', '33.333%']],
      4: [
        ['50%', '50%'],
        ['50%', '50%'],
      ],
      5: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%'],
      ],
      6: [
        ['33.333%', '33.333%', '33.333%'],
        ['33.333%', '33.333%', '33.333%'],
      ],
      7: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%'],
      ],
      8: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
      ],
      9: [['25%', '25%', '25%', '25%'], ['25%', '25%', '25%', '25%'], ['25%']],
      10: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%'],
      ],
      11: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%'],
      ],
      12: [
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
        ['25%', '25%', '25%', '25%'],
      ],
    },
  },
};

const VideoGrid = ({
  testID,
  participants,
  gap = 8,
  maxColumns = 6,
  maxTiles = 24,
  minWidth = MIN_WIDTH,
  localParticipant = true,
  renderItem,
  renderMaxTile,
  ...props
}: VideoGridProps) => {
  const { participantsStatus, participant } = useParticipants();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { getColor, isMobile, isMobileSmall, isTablet, isDesktop, isLandscape } = useTheme();
  const [width, setWidth] = useState(minWidth);
  const [activeHistory, setActiveHistory] = useState<Record<string, number>>({});
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const isSmartphone = isMobileSmall || isMobile;

  const handleSetWidth = (value: number) => {
    setWidth(value > minWidth ? value : minWidth);
  };

  const actualMaxTiles = useMemo(() => {
    let max = 5;
    if (isMobile) {
      max = 7;
    } else if (isTablet) {
      max = 18;
    } else if (isDesktop) {
      max = maxTiles - 2;
    }
    return max;
  }, [isMobile, isMobileSmall, isTablet, isDesktop]);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    Object.keys(participantsStatus).forEach((key) => {
      const { isSpeaking, isVideo } = participantsStatus[key];
      if (participant && participant.id !== key) {
        if (isSpeaking || isVideo) {
          setActiveHistory((prev) => ({
            ...prev,
            [key]: Date.now(),
          }));
          if (activeSpeakers.indexOf(key) === -1) {
            if (activeSpeakers.length < actualMaxTiles) {
              setActiveSpeakers((prev) => [...prev, key]);
            } else {
              // find last speaker
              let index = 0;
              let lowest = 0;
              activeSpeakers.forEach((id, i) => {
                const time = activeHistory[id];
                if (time) {
                  if (i === 0) {
                    lowest = time;
                  } else if (time < lowest) {
                    index = i;
                    lowest = time;
                  }
                }
              });
              // replace last speaker with new one to his place
              setActiveSpeakers((prev) => {
                const copy = [...prev];
                copy.splice(index, 1, key);
                return copy;
              });
            }
          }
        }
      }
    });
  }, [participants, participantsStatus, isLandscape, actualMaxTiles]);

  const [tiles, restTiles] = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    const withoutLocal: Participant[] = [];
    let local: Participant | null = null;
    participants.forEach((p) => {
      if (p.id === participant?.id) {
        local = p;
      } else {
        withoutLocal.push(p);
      }
    });
    if (withoutLocal.length > actualMaxTiles) {
      const order: Record<string, number> = {};

      activeSpeakers.forEach((id, index) => {
        order[id] = index;
      });

      withoutLocal.sort((a, b) => {
        const orderA = order[a.id];
        const orderB = order[b.id];
        if (orderA === undefined && orderB === undefined) {
          return 0;
        }
        if (orderA === undefined) {
          return 1;
        }
        if (orderB === undefined) {
          return -1;
        }
        return orderA - orderB;
      });
    }
    let tiles: Participant[] = withoutLocal.slice(0, actualMaxTiles);
    let restTiles: Participant[] = withoutLocal.slice(actualMaxTiles);
    if (localParticipant && local) {
      if (tiles.length === 0) {
        tiles = [local];
        restTiles = [];
      } else {
        tiles.push(local);
      }
    }
    if ((isDesktop || isTablet) && restTiles.length === 1) {
      tiles = [...restTiles, ...tiles];
      restTiles = [];
    }
    return [tiles, restTiles];
  }, [
    participants,
    localParticipant,
    participant,
    activeSpeakers,
    width,
    participantsStatus,
    isLandscape,
    actualMaxTiles,
  ]);

  const tileWidth = () => {
    if (wrapperRef.current && isDesktop) {
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
      } else if (tiles.length <= 12) {
        options.clientWidth = clientWidth / 4;
        options.rows = 3;
      } else if (tiles.length <= 18) {
        options.clientWidth = clientWidth / 6;
        options.rows = 3;
      } else {
        options.clientWidth = clientWidth / maxColumns;
      }
      handleSetWidth(fitInHeight(options).width);
    }
  };

  const containerWidth = useMemo(() => {
    if (!isDesktop) {
      return '100%';
    }
    if (tiles.length === 4) {
      return 2 * width + gap * 2;
    }
    if (tiles.length <= 9) {
      return 3 * width + gap * 3;
    }
    if (tiles.length <= 12) {
      return 4 * width + gap * 4;
    }
    if (tiles.length <= 18) {
      return 6 * width + gap * 6;
    }
    return '100%';
  }, [width, maxColumns, isLandscape, participants.length]);

  useEffect(() => {
    tileWidth();
    window.addEventListener('resize', tileWidth);
    return () => window.removeEventListener('resize', tileWidth);
  }, [participants.length, maxColumns, isLandscape]);

  const getGridSize = (i = 0) => {
    if (isDesktop) {
      return {
        minWidth: `${minWidth}px`,
        width: `${width}px`,
      };
    }
    const deviceType = isMobileSmall ? MOBILE_SMALL : isMobile ? MOBILE : TABLET;
    const deviceOrientation = isLandscape ? LANDSCAPE : PORTRAIT;
    const length = tiles.length + (isSmartphone ? 0 : restTiles.length > 0 ? 1 : 0);
    const grid = TILES_MAP[deviceType][deviceOrientation][length];
    if (grid) {
      return {
        width: grid.flat()[i],
        height: `${100 / grid.length}%`,
      };
    }
    if (isLandscape) {
      if (participants.length <= 16) {
        return {
          width: '25%',
          height: '25%',
        };
      }
      return {
        width: '20%',
        height: '25%',
      };
    }
    if (participants.length <= 16) {
      return {
        width: '25%',
        height: '25%',
      };
    }

    return {
      width: '25%',
      height: '20%',
    };
  };

  if (participants.length === 0) {
    return null;
  }

  return (
    <div
      data-testid={testID}
      ref={wrapperRef}
      className={styles.wrapper}
      style={!isSmartphone ? { margin: `0 -${gap}px` } : undefined}
      {...props}
    >
      <Space
        className={cx(styles.content)}
        style={
          tiles.length === 1
            ? { width: '100%', height: '100%' }
            : { width: containerWidth, height: !isDesktop ? '100%' : undefined }
        }
      >
        {tiles.map((p, i) => (
          <Space
            className={styles.videoItem}
            key={`${p.id}-${p.streams[p.streams.length - 1]?.getVideoTracks()[0]?.id}`}
            style={{ ...getGridSize(i), padding: tiles.length === 1 ? 0 : `${isSmartphone ? gap / 2 : gap}px` }}
          >
            {renderItem(p)}
          </Space>
        ))}
        {restTiles.length > 0 && !isSmartphone && (
          <Space className={styles.maxTile} style={{ ...getGridSize(tiles.length), padding: `${gap}px` }}>
            <Space className={cx(styles.maxTileWrapper, { [styles.desktop]: isDesktop })}>
              {renderMaxTile ? (
                renderMaxTile(restTiles)
              ) : (
                <Space className={styles.maxTileContent} style={{ backgroundColor: getColor('grey.700') }}>
                  <Text type="H0">
                    <span>+</span>
                    {restTiles.length}
                  </Text>
                </Space>
              )}
            </Space>
          </Space>
        )}
        {restTiles.map((p) => (
          <HiddenVideoTile key={p.id} participant={p} />
        ))}
      </Space>
    </div>
  );
};

export default VideoGrid;
