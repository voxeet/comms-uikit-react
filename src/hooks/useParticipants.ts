import { useContext, useMemo } from 'react';

import { CommsContext } from '../providers/CommsProvider';

const DISPLAYED_STATUSES = ['Connected', 'Inactive'];

const useParticipants = () => {
  const { participants: rawParticipants, participantsStatus, addIsSpeakingListener } = useContext(CommsContext);

  const participants = useMemo(() => {
    return rawParticipants.filter((p) => p.status && DISPLAYED_STATUSES.includes(p.status));
  }, [rawParticipants]);

  return {
    participants,
    participantsStatus,
    addIsSpeakingListener,
  };
};

export default useParticipants;
