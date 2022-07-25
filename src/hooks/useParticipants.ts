import { useContext, useMemo } from 'react';

import { CommsContext } from '../providers/CommsProvider';

import type { UseParticipants } from './types/Participants';

const DISPLAYED_STATUSES = ['Connected', 'Inactive'];

const useParticipants: UseParticipants = () => {
  const {
    participants: rawParticipants,
    participantsStatus,
    addIsSpeakingListener,
    participant,
  } = useContext(CommsContext);

  const participants = useMemo(() => {
    return rawParticipants.filter((p) => p.status && DISPLAYED_STATUSES.includes(p.status));
  }, [rawParticipants]);

  return {
    participant,
    participants,
    participantsStatus,
    addIsSpeakingListener,
  };
};

export default useParticipants;
