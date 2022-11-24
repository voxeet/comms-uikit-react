import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';
import React, { useEffect } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import IconIndicator from '../../ui/indicators/IconIndicator/IconIndicator';
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
  const { getColor, isMobileSmall, isMobile } = useTheme();
  const { addIsSpeakingListener, participantsStatus } = useParticipants();

  const { isSpeaking, isRemoteAudio, isLocal, isLocalAudio } = participantsStatus[participant.id] || {};

  const isSmartphone = isMobileSmall || isMobile;

  useEffect(() => {
    return addIsSpeakingListener(participant);
  }, []);

  return (
    <Space
      testID="ParticipantsGridItem"
      className={cx(styles.item, { [styles.mobile]: isSmartphone })}
      fw
      fh
      css={{
        '&:after': {
          display: isSpeaking ? 'block' : 'none',
          borderColor: isSpeaking && isRemoteAudio ? getColor('purple.400') : getColor('transparent'),
        },
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
      </Space>
      {!isLocal && !isLocalAudio && (
        <Space
          className={cx(styles.indicatorsContainer, isMobile && styles.mobile, isMobileSmall && styles.mobileSmall)}
        >
          <IconIndicator
            testID="SpeakerOffIndicator"
            icon="speakerOff"
            backgroundColor="white"
            iconColor="primary.400"
          />
        </Space>
      )}

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
