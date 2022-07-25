import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useMemo } from 'react';

import useParticipants from '../../../hooks/useParticipants';
import Space from '../../ui/Space/Space';
import ParticipantsListItem from '../ParticipantsListItem/ParticipantsListItem';

type ParticipantsListProps = {
  localText: string;
  muteText: string;
  unmuteText: string;
  soundOnText: string;
  soundOffText: string;
  testID?: string;
};

const ParticipantsList = ({
  testID,
  localText,
  muteText,
  unmuteText,
  soundOnText,
  soundOffText,
}: ParticipantsListProps) => {
  const { participants, participant } = useParticipants();

  const participantsListToDisplay = useMemo(() => {
    let list: Participant[] = [];
    if (participant) {
      for (let i = 0; i < participants.length; i++) {
        const element = participants[i];
        if (element.id === participant.id) {
          list.unshift(element);
          participants.splice(i, 1);
          list = [...list, ...participants];
          break;
        }
      }
    }
    return list;
  }, [participants]);
  return (
    <Space testID={testID}>
      {participantsListToDisplay.map((p) => (
        <ParticipantsListItem
          participant={p}
          localText={localText}
          key={p.id}
          muteText={muteText}
          unmuteText={unmuteText}
          soundOnText={soundOnText}
          soundOffText={soundOffText}
        />
      ))}
    </Space>
  );
};

export default ParticipantsList;
