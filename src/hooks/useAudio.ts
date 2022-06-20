import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

const useAudio = () => {
  const { isAudio, toggleAudio, resetAudio, startParticipantAudio, stopParticipantAudio } = useContext(CommsContext);

  return {
    isAudio,
    toggleAudio,
    resetAudio,
    startParticipantAudio,
    stopParticipantAudio,
  };
};

export default useAudio;
