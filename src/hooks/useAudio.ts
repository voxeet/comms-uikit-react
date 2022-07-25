import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

import type { UseAudio } from './types/Audio';

const useAudio: UseAudio = () => {
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
