import { useContext, useMemo } from 'react';

import { CommsContext } from '../providers/CommsProvider';

const DISPLAYED_STATUSES = ['CONNECTED', 'INACTIVE'];

const useParticipants = () => {
  const {
    participants: rawParticipants,
    isMuted,
    toggleMute,
    addIsSpeakingListener,
    participantsIsSpeaking,
    muteParticipant,
    isVideo,
    toggleVideo,
  } = useContext(CommsContext);

  const participants = useMemo(() => {
    return rawParticipants.filter((p) => p.status && DISPLAYED_STATUSES.includes(p.status));
  }, [rawParticipants]);

  return {
    participants,
    muteParticipant,
    isMuted,
    toggleMute,
    addIsSpeakingListener,
    participantsIsSpeaking,
    isVideo,
    toggleVideo,
  };
};

export default useParticipants;
