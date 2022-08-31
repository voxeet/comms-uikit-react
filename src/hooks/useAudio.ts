import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

import type { UseAudio } from './types/Audio';
import { BlockedAudioState } from './types/Audio';

const useAudio: UseAudio = () => {
  const {
    isAudio,
    toggleAudio,
    resetAudio,
    startParticipantAudio,
    stopParticipantAudio,
    playBlockedAudio,
    blockedAudioState,
    setBlockedAudioState,
    isPageMuted,
    toggleMuteParticipants,
  } = useContext(CommsContext);

  const markBlockedAudioActivated = () => {
    setBlockedAudioState(BlockedAudioState.ACTIVATED);
  };

  const markBlockedAudioEnabled = () => {
    setBlockedAudioState(BlockedAudioState.ENABLED);
  };

  return {
    isAudio,
    toggleAudio,
    resetAudio,
    startParticipantAudio,
    stopParticipantAudio,
    playBlockedAudio,
    blockedAudioState,
    markBlockedAudioActivated,
    markBlockedAudioEnabled,
    toggleMuteParticipants,
    isPageMuted,
  };
};

export default useAudio;
