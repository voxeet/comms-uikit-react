import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import type { CSSProperties } from 'react';

import { Space, useConference, useParticipants, VideoGrid } from '../../../index';
import ParticipantsGridItem from '../ParticipantsGridItem/ParticipantsGridItem';

import styles from './ParticipantsGrid.module.scss';

type ParticipantsGridProps = {
  localText: string;
  localParticipant?: boolean;
  testID?: string;
  additionalContainerStyle?: CSSProperties;
};

const ParticipantsGrid = ({
  localText,
  localParticipant = true,
  testID,
  additionalContainerStyle,
}: ParticipantsGridProps) => {
  const { conference } = useConference();
  const { participants } = useParticipants();

  if (conference === null || participants.length === 0) {
    return null;
  }

  const renderParticipant = (p: Participant) => {
    return <ParticipantsGridItem participant={p} localText={localText} />;
  };

  return (
    <Space testID={testID} className={styles.gridWrapper} style={additionalContainerStyle}>
      <VideoGrid participants={participants} renderItem={renderParticipant} localParticipant={localParticipant} />
    </Space>
  );
};

export default ParticipantsGrid;
