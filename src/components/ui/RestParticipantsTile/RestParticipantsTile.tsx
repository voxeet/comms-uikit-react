import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';
import Avatar from '../Avatar/Avatar';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './RestParticipantsTile.module.scss';

type RestParticipantsTileProps = {
  participants: Participant[];
  testID?: string;
};

const RestParticipantsTile = ({ participants, testID }: RestParticipantsTileProps) => {
  const { getColor } = useTheme();
  const avatars = useMemo(() => {
    return participants.slice(0, 3);
  }, [participants]);
  return (
    <Space className={styles.wrapper} style={{ backgroundColor: getColor('grey.700') }} data-testid={testID}>
      <Space className={styles.content}>
        <Space testID="avatarRow" className={styles.avatarsRow} mb="s">
          {avatars.map((participant, i) => (
            <Avatar testID={`avatar-${i}`} key={participant.id} participant={participant} size="m" />
          ))}
        </Space>
        <Text testID="restCaption" type="captionSmall">
          <span>+</span>
          {participants.length}
        </Text>
      </Space>
    </Space>
  );
};

export default RestParticipantsTile;
