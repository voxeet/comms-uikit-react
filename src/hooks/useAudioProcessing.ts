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
  // echoCancellation is on by default
  const isEchoCancellationOn =
    (audioMode?.modeOptions?.echoCancellation || AudioEchoCancellation.On) === AudioEchoCancellation.On;

  useEffect(() => {
    if (isAudio && !audioMode) {
      getAudioCaptureMode();
    }
  }, [audioMode, getAudioCaptureMode, isAudio]);

  const toggleEchoCancellation = useCallback(async () => {
    return setAudioCaptureMode({
      modeOptions: {
        echoCancellation: isEchoCancellationOn ? AudioEchoCancellation.Off : AudioEchoCancellation.On,
      },
      mode: audioMode?.mode || AudioCaptureMode.Standard,
    });
  }, [audioMode?.mode, isEchoCancellationOn, setAudioCaptureMode]);

  const setNoiseReductionLevel = useCallback(
    async (value: NoiseReductionLevel) => {
      return setAudioCaptureMode({
        modeOptions: {
          noiseReductionLevel: value,
        },
        mode: audioMode?.mode || AudioCaptureMode.Standard,
      });
    },
    [audioMode?.mode, setAudioCaptureMode],
  );

  const removeAudioCaptureError = (error?: ErrorCodes) => {
    return removeError({ error, context: 'audioCapture' });
  };

  return {
    setAudioCaptureMode,
    getAudioCaptureMode,
    audioMode,
    isEchoCancellationOn,
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
