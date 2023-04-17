import { useMemo } from 'react';

import type { ErrorCodes } from '../providers/CommsProvider';

import type { UseRecording } from './types/Recording';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const useRecording: UseRecording = () => {
  const {
    startRecording,
    stopRecording,
    recordingData,
    errors: { recordingErrors: errorMessages },
    setContextErrors,
    resetRecordingData,
  } = useCommsContext();
  const { ownerId, timestamp, status, isRecordingModeActive } = recordingData;
  const { participant } = useSession();

  const isLocalUserRecordingOwner = useMemo(() => {
    return ownerId === participant?.id;
  }, [ownerId, participant]);

  const setRecordingErrors = (error?: ErrorCodes) => {
    setContextErrors({ error, context: 'recordingErrors' });
  };

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
    isError: Object.keys(errorMessages).length > 0,
  };
};

export default useRecording;
