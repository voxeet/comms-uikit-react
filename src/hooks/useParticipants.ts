import { useMemo } from 'react';

import type { UseParticipants } from './types/Participants';
import useCommsContext from './useCommsContext';

const DISPLAYED_STATUSES = ['Connected', 'Inactive'];

const useParticipants: UseParticipants = () => {
  const { participants: rawParticipants, participantsStatus, addIsSpeakingListener, participant } = useCommsContext();

  const participants = useMemo(() => {
    return rawParticipants.filter((p) => p.status && DISPLAYED_STATUSES.includes(p.status) && p.type !== 'mixer');
  }, [rawParticipants]);

  return {
    participant,
    participants,
    participantsStatus,
    addIsSpeakingListener,
  };
};

export default useParticipants;
