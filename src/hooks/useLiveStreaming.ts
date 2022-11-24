import { useMemo } from 'react';

import type { UseLiveStreaming } from './types/LiveStreaming';
import useCommsContext from './useCommsContext';
import useSession from './useSession';

const useLiveStreaming: UseLiveStreaming = () => {
  const {
    startLiveStreaming,
    stopLiveStreaming,
    liveStreamingData,
    resetLiveStreamingData,
    setLiveStreamingErrors,
    liveStreamingErrorMessages: errorMessages,
  } = useCommsContext();

  const { owner, timestamp, status, isLiveStreamingModeActive, provider, rtmp } = liveStreamingData;
  const { participant } = useSession();

  const isLocalUserLiveStreamingOwner = useMemo(() => {
    return owner?.id === participant?.id;
  }, [owner, participant]);

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
    isError: errorMessages.length > 0,
    rtmp,
  };
};

export default useLiveStreaming;
