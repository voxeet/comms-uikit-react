import type { UseAudio } from './types/Audio';
import { BlockedAudioState } from './types/Audio';
import useCommsContext from './useCommsContext';

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
  } = useCommsContext();

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
