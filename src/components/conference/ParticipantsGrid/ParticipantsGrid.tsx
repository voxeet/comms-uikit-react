import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import { Space, useConference, useParticipants, VideoGrid } from '../../../index';
import ParticipantsGridItem from '../ParticipantsGridItem/ParticipantsGridItem';

import styles from './ParticipantsGrid.module.scss';

type ParticipantsGridProps = {
  localText: string;
  localParticipant?: boolean;
  testID?: string;
};

const ParticipantsGrid = ({ localText, localParticipant = true, testID }: ParticipantsGridProps) => {
  const { conference } = useConference();
  const { participants, participant } = useParticipants();

  if (conference === null || participants.length === 0) {
    return null;
  }

  const renderParticipant = (p: Participant) => {
    if (!localParticipant && p.id === participant?.id) {
      return null;
    }
    return <ParticipantsGridItem participant={p} localText={localText} />;
  };

  return (
    <Space testID={testID} className={styles.gridWrapper}>
      <VideoGrid participants={participants} renderItem={renderParticipant} />
    </Space>
  );
};

export default ParticipantsGrid;
