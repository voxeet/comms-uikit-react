import { useMemo } from 'react';

import type { UseRecording } from './types/Recording';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const useRecording: UseRecording = () => {
  const {
    startRecording,
    stopRecording,
    recordingData,
    setRecordingErrors,
    recordingErrorMessages: errorMessages,
    resetRecordingData,
  } = useCommsContext();
  const { ownerId, timestamp, status, isRecordingModeActive } = recordingData;
  const { participant } = useSession();

  const isLocalUserRecordingOwner = useMemo(() => {
    return ownerId === participant?.id;
  }, [ownerId, participant]);

  return {
    startRecording,
    stopRecording,
    ownerId,
    timestamp,
    isLocalUserRecordingOwner,
    status,
    setRecordingErrors,
    resetRecordingData,
    isRecordingModeActive,
    isError: errorMessages.length > 0,
  };
};

export default useRecording;
