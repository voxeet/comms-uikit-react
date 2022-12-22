/* eslint-disable no-nested-ternary */
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useScreenSharing from '../../../hooks/useScreenSharing';
import useSizeObserver from '../../../hooks/useSizeObserver';
import useTheme from '../../../hooks/useTheme';
import { CalculateGrid, calculateGrid, countMaxTiles, manipulateSize } from '../../../utils/videoGrid.util';
import HiddenVideoTile from '../HiddenVideoTile/HiddenVideoTile';
import RestParticipantsTile from '../RestParticipantsTile/RestParticipantsTile';
import Space from '../Space/Space';

import styles from './VideoGrid.module.scss';

type VideoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  participants: Participant[];
  gap?: number;
  maxTiles?: number;
  localParticipant?: boolean;
  renderItem: (participant: Participant) => ReactNode;
  renderMaxTile?: (participants: Participant[]) => ReactNode;
  presenterFirst?: boolean;
};

const VideoGrid = ({
  testID,
  participants,
  gap = 8,
  maxTiles = 24,
  localParticipant = true,
  renderItem,
  renderMaxTile,
  presenterFirst = true,
  ...props
}: VideoGridProps) => {
  const { participantsStatus, participant } = useParticipants();
  const { owner } = useScreenSharing();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isLandscape } = useTheme();
  const [actualMaxTiles, setActualMaxTiles] = useState(0);
  const [tileSize, setTileSize] = useState<CalculateGrid | null>(null);
  const [activeHistory, setActiveHistory] = useState<Record<string, number>>({});
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const wrapperSize = useSizeObserver(wrapperRef);

  useEffect(() => {
    if (wrapperSize) {
      const countedTiles = countMaxTiles({
        container: wrapperSize,
        maxTiles,
      });
      setActualMaxTiles(countedTiles);
    }
  }, [wrapperSize]);

  const availableSpace = useMemo(() => {
    return (
      actualMaxTiles -
      (localParticipant ? 1 : 0) -
      (presenterFirst && owner ? 1 : 0) -
      (participants.length > actualMaxTiles ? 1 : 0)
    );
  }, [localParticipant, presenterFirst, actualMaxTiles, participants]);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    Object.keys(participantsStatus).forEach((key) => {
      const { isSpeaking, isVideo } = participantsStatus[key];
      if (participant?.id !== key && owner?.id !== key) {
        if (isSpeaking || isVideo || activeHistory[key] === undefined) {
          setActiveHistory((prev) => ({
            ...prev,
            [key]: Date.now(),
          }));

          const actualSpeakers = activeSpeakers.slice(0, availableSpace);

          if (actualSpeakers.indexOf(key) === -1) {
            if (actualSpeakers.length < availableSpace) {
              setActiveSpeakers(() => [...actualSpeakers, key]);
            } else {
              // find last speaker
              let index = 0;
              let lowest = 0;
              actualSpeakers.forEach((id, i) => {
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
              setActiveSpeakers(() => {
                const copy = [...actualSpeakers];
                copy.splice(index, 1, key);
                return copy;
              });
            }
          }
        }
      }
    });
  }, [participants, participantsStatus, isLandscape, actualMaxTiles, availableSpace]);

  const [tiles, restTiles] = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    const withoutLocal: Participant[] = [];
    let local: Participant | null = null;
    let presenter: Participant | null = null;
    participants.forEach((p) => {
      if (p.id === participant?.id) {
        local = p;
      } else if (presenterFirst && p.id === owner?.id) {
        presenter = p;
      } else {
        withoutLocal.push(p);
      }
    });
    if (withoutLocal.length > actualMaxTiles - 2) {
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

    if (presenter) {
      withoutLocal.unshift(presenter);
    }
    /*
     There shouldn't be situation when we are setting actualMaxTiles to 1 since therefore we won't be able to see rest size
     */
    let tiles: Participant[] = withoutLocal.slice(0, actualMaxTiles - 2);
    let restTiles: Participant[] = withoutLocal.slice(actualMaxTiles - 2);
    if (restTiles.length === 1) {
      tiles = [...tiles, ...restTiles];
      restTiles = [];
    }
    if (localParticipant && local) {
      if (tiles.length === 0) {
        tiles = [local];
      } else {
        tiles.push(local);
      }
    }
    return [tiles, restTiles];
  }, [participants, localParticipant, participant, activeSpeakers, participantsStatus, isLandscape, actualMaxTiles]);

  useEffect(() => {
    if (wrapperSize) {
      const size = calculateGrid({
        container: wrapperSize,
        elements: tiles.length + (restTiles.length ? 1 : 0),
        gap: participants.length === 1 ? 0 : gap,
      });
      setTileSize(size);
    }
  }, [wrapperSize, participants, tiles, restTiles]);

  if (participants.length === 0) {
    return null;
  }
  return (
    <Space className={styles.container} fh data-testid={testID}>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        {...props}
        style={tiles.length === 1 ? undefined : { margin: `-${gap}px`, height: `calc(100% + ${gap * 2}px)` }}
      >
        {tileSize && (
          <Space fw fh className={cx(styles.content)} style={{ padding: `${tiles.length === 1 ? 0 : gap / 2}px` }}>
            {tiles.map((p, i) => (
              <Space
                className={cx(styles.tileWrapper)}
                key={`${p.id}-${p.streams[p.streams.length - 1]?.getVideoTracks()[0]?.id}`}
                style={{
                  ...manipulateSize(wrapperSize, tileSize, i, tiles.length, restTiles.length),
                  padding: tiles.length === 1 ? 0 : `${gap / 2}px`,
                }}
              >
                {renderItem(p)}
              </Space>
            ))}
            {restTiles.length > 0 && (
              <Space
                style={{
                  ...manipulateSize(wrapperSize, tileSize, -1, tiles.length, restTiles.length),
                  padding: `${gap / 2}px`,
                }}
              >
                <Space fh className={styles.maxTileWrapper}>
                  {renderMaxTile ? renderMaxTile(restTiles) : <RestParticipantsTile participants={restTiles} />}
                </Space>
              </Space>
            )}
            {restTiles.map((p) => (
              <HiddenVideoTile key={p.id} participant={p} />
            ))}
          </Space>
        )}
      </div>
    </Space>
  );
};

export default VideoGrid;
