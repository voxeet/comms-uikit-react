import { useMemo } from 'react';

import type { ErrorCodes } from '../providers/CommsProvider';

import type { UseLiveStreaming } from './types/LiveStreaming';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const useLiveStreaming: UseLiveStreaming = () => {
  const {
    startLiveStreaming,
    stopLiveStreaming,
    liveStreamingData,
    resetLiveStreamingData,
    errors: { liveStreamingErrors: errorMessages },
    setContextErrors,
  } = useCommsContext();

  const { owner, timestamp, status, isLiveStreamingModeActive, provider, rtmp } = liveStreamingData;
  const { participant } = useSession();

  const isLocalUserLiveStreamingOwner = useMemo(() => {
    return owner?.id === participant?.id;
  }, [owner, participant]);

  const setLiveStreamingErrors = (error?: ErrorCodes) => {
    setContextErrors({ error, context: 'liveStreamingErrors' });
  };

  return {
    owner,
    startLiveStreaming,
    stopLiveStreaming,
    resetLiveStreamingData,
    timestamp,
    status,
    isLiveStreamingModeActive,
    isLocalUserLiveStreamingOwner,
    setLiveStreamingErrors,
    provider,
    isError: Object.keys(errorMessages).length > 0,
    rtmp,
  };
};

export default useLiveStreaming;
