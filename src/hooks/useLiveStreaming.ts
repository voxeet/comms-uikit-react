import { useMemo } from 'react';

import type { ErrorCodes } from '../providers/CommsProvider';

import type { UseLiveStreaming, LiveStreamProvider } from './types/LiveStreaming';
import useCommsContext from './useCommsContext';
import useConference from './useConference';
import useSession from './useSession';

const determineProvider = (rtmpURL: string) => {
  switch (true) {
    case /youtube/gi.test(rtmpURL):
      return 'youtube';
    case /facebook/gi.test(rtmpURL):
      return 'facebook';
    case /twitch/gi.test(rtmpURL):
      return 'twitch';
    default:
      return 'other';
  }
};

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
  const { conference } = useConference();

  const startLiveStreamingByProxy = async (baseUrl: string, rtmpUrl: string) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conferenceId: conference?.id,
        rtmpUrl,
      }),
    } as const;
    const request = async () => {
      const result = await fetch(`${baseUrl}/stream/rtmp/start`, params);
      if (result.status === 400) throw new Error(`${result.statusText}`);
    };
    const provider = determineProvider(rtmpUrl) as LiveStreamProvider;
    return startLiveStreaming(request, rtmpUrl, provider);
  };

  const stopLiveStreamingByProxy = async (baseUrl: string) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conferenceId: conference?.id,
      }),
      keepalive: true,
    } as const;
    const request = async () => {
      await fetch(`${baseUrl}/stream/rtmp/stop`, params);
    };
    return stopLiveStreaming(request);
  };

  const isLocalUserLiveStreamingOwner = useMemo(() => {
    return owner?.id === participant?.id;
  }, [owner, participant]);

  const setLiveStreamingErrors = (error?: ErrorCodes) => {
    setContextErrors({ error, context: 'liveStreamingErrors' });
  };

  const sendStreamingBeacon = (baseUrl: string) => {
    if (isLiveStreamingModeActive) {
      const data = JSON.stringify({
        conferenceId: conference?.id,
      });
      if (!navigator.sendBeacon(`${baseUrl}/stream/rtmp/stop`, data)) {
        console.error('failed to send beacon to stop rtmp stream');
      }
    }
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
    startLiveStreamingByProxy,
    stopLiveStreamingByProxy,
    sendStreamingBeacon,
  };
};

export default useLiveStreaming;
