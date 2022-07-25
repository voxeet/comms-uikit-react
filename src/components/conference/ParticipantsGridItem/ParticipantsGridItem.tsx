import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import React, { useEffect } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import Space from '../../ui/Space/Space';
import LocalName from '../LocalName/LocalName';
import LocalSpeakingIndicator from '../LocalSpeakingIndicator/LocalSpeakingIndicator';
import LocalVideo from '../LocalVideo/LocalVideo';
import ParticipantName from '../ParticipantName/ParticipantName';
import ParticipantSpeakingIndicator from '../ParticipantSpeakingIndicator/ParticipantSpeakingIndicator';
import ParticipantVideo from '../ParticipantVideo/ParticipantVideo';

import styles from './ParticipantsGridItem.module.scss';

type ParticipantsGridItemProps = {
  participant: Participant;
  localText: string;
};

const ParticipantsGridItem = React.memo(({ participant, localText }: ParticipantsGridItemProps) => {
  const { getColor } = useTheme();
  const { addIsSpeakingListener, participantsStatus } = useParticipants();

  const { isSpeaking, isRemoteAudio, isLocalAudio, isLocal } = participantsStatus[participant.id] || {};

  useEffect(() => {
    return addIsSpeakingListener(participant);
  }, []);

  return (
    <Space
      testID="ParticipantsGridItem"
      className={styles.item}
      style={{
        borderColor: isSpeaking && isRemoteAudio && isLocalAudio ? getColor('purple.400') : getColor('transparent'),
      }}
    >
      {isLocal ? (
        <LocalVideo testID="LocalVideo" />
      ) : (
        <ParticipantVideo testID="ParticipantVideo" participant={participant} />
      )}
      <Space className={styles.pill}>
        {isLocal ? (
          <LocalName text={localText} testID="LocalName" />
        ) : (
          <ParticipantName testID="ParticipantName" participant={participant} />
        )}
        {/* {isLocal ? (
          <LocalQualityIndicator testID="LocalQualityIndicator" />
        ) : (
          <ParticipantQualityIndicator testID="ParticipantQualityIndicator" participant={participant} />
        )} */}
      </Space>
      <Space className={styles.talking}>
        {isLocal ? (
          <LocalSpeakingIndicator testID="LocalSpeakingIndicator" />
        ) : (
          <ParticipantSpeakingIndicator testID="ParticipantSpeakingIndicator" participant={participant} />
        )}
      </Space>
    </Space>
  );
});

export default ParticipantsGridItem;
