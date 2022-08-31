import type { Participant as ParticipantType } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import cx from 'classnames';

import useParticipants from '../../../hooks/useParticipants';
import useTheme from '../../../hooks/useTheme';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';
import LocalAvatar from '../LocalAvatar/LocalAvatar';
import LocalToggleAudioButton from '../LocalToggleAudioButton/LocalToggleAudioButton';
import ParticipantAvatar from '../ParticipantAvatar/ParticipantAvatar';
import ParticipantToggleAudioButton from '../ParticipantToggleAudioButton/ParticipantToggleAudioButton';

import styles from './ParticipantsListItem.module.scss';

type ParticipantsListItemProps = {
  participant: ParticipantType;
  localText: string;
  muteText: string;
  unmuteText: string;
  soundOnText: string;
  soundOffText: string;
  testID?: string;
};

const ParticipantsListItem = ({
  participant,
  localText,
  muteText,
  unmuteText,
  soundOnText,
  soundOffText,
  testID = 'ParticipantsListItem',
}: ParticipantsListItemProps) => {
  const { participantsStatus } = useParticipants();

  const { getColor } = useTheme();

  const { isLocal } = participantsStatus[participant.id] || {};

  return (
    <Space p="s" testID={testID} className={cx(styles.listElement)}>
      <Space fw fh className={styles.elementsWrapper}>
        <Space pr="xs" className={styles.avatarSection}>
          {isLocal ? (
            <LocalAvatar testID="LocalAvatar" size="s" borderColor="grey.100" />
          ) : (
            <ParticipantAvatar testID="ParticipantAvatar" size="s" participant={participant} borderColor="grey.100" />
          )}
        </Space>
        <Space className={styles.nameSection}>
          <Space className={styles.participantName}>
            <Text testID="DrawerParticipantName" type="H4" color="grey.100">
              {participant.info.name}
            </Text>
            {participantsStatus[participant.id]?.isLocal && (
              <>
                <span>&nbsp;</span>
                <Text testID="LocalUserIndicator" type="H4" color="grey.100">
                  {`(${localText})`}
                </Text>
              </>
            )}
          </Space>
        </Space>
        <Space className={styles.actionsSection}>
          <Space className={styles.actionButton}>
            {isLocal ? (
              <LocalToggleAudioButton size="s" activeTooltipText={muteText} inactiveTooltipText={unmuteText} />
            ) : (
              <ParticipantToggleAudioButton
                size="s"
                participant={participant}
                activeTooltipText={soundOffText}
                inactiveTooltipText={soundOnText}
              />
            )}
          </Space>
          {/* <Space className={styles.actionButton}>
            {isLocal ? (
              ''
            ) : (
              <ParticipantToggleVideoButton
                size="s"
                participant={participant}
                activeTooltipText={intl.formatMessage({ id: 'videoOff' })}
                inactiveTooltipText={intl.formatMessage({ id: 'videoOn' })}
              />
            )}
          </Space> */}
        </Space>
      </Space>
      <Space className={styles.divider} style={{ backgroundColor: getColor('grey.700') }} />
    </Space>
  );
};

export default ParticipantsListItem;
