import { useCallback, useEffect } from 'react';

import type { ErrorCodes } from '../providers/CommsProvider';
import { isEdgeOrChromeBrowser } from '../utils/misc';

import {
  AudioEchoCancellation,
  type UseAudioProcessing,
  type NoiseReductionLevel,
  AudioCaptureMode,
} from './types/UseAudioProcessing';
import useCommsContext from './useCommsContext';

const useAudioProcessing: UseAudioProcessing = () => {
  const { getAudioCaptureMode, setAudioCaptureMode, audioMode, errors, removeError, isAudio } = useCommsContext();
  const echoCancellation = audioMode?.modeOptions?.echoCancellation === AudioEchoCancellation.On;

  useEffect(() => {
    if (isAudio && !audioMode) {
      getAudioCaptureMode();
    }
  }, [isAudio]);

  const toggleEchoCancellation = useCallback(async () => {
    return setAudioCaptureMode({
      modeOptions: {
        echoCancellation: !echoCancellation ? AudioEchoCancellation.On : AudioEchoCancellation.Off,
      },
    });
  }, [audioMode, isAudio, echoCancellation]);

  const setNoiseReductionLevel = useCallback(
    async (value: NoiseReductionLevel) => {
      return setAudioCaptureMode({
        modeOptions: {
          noiseReductionLevel: value,
        },
      });
    },
    [audioMode, isAudio],
  );

  const removeAudioCaptureError = (error?: ErrorCodes) => {
    return removeError({ error, level: 'audioCapture' });
  };

  return {
    setAudioCaptureMode,
    getAudioCaptureMode,
    audioMode,
    echoCancellation,
    isMusicMode: audioMode?.mode === AudioCaptureMode.Music,
    toggleEchoCancellation,
    setNoiseReductionLevel,
    /*
      Music mode is only available while 'dvwc' is turned on while joining conference
     */
    isMusicModeSupported: isEdgeOrChromeBrowser,
    isError: !!Object.values(errors.audioCapture).length,
    removeAudioCaptureError,
  };
};

export default useAudioProcessing;
