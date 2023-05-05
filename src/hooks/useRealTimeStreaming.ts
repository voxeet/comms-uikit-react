import { useEffect, useState } from 'react';

import type { UseRealTimeStreaming } from './types/RealTimeStreaming';
import useCommsContext from './useCommsContext';

function getFetchOptions(body: unknown) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

const useRealTimeStreaming: UseRealTimeStreaming = (proxyBaseUrl: string) => {
  const { conference, participants } = useCommsContext();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(participants.some((p) => p.info.externalId === 'Mixer_rts' || p.info.externalId === 'mixer_mix'));
  }, [participants]);

  const startRealTimeStreaming = async () => {
    if (!conference) {
      throw new Error('Tried to start Real-time Streaming but no conference is available');
    }
    const res = await fetch(`${proxyBaseUrl}/event/start`, getFetchOptions({ conferenceId: conference.id }));
    if (res.status !== 200) {
      const errorMessage = await res.json();
      throw new Error(`Could not start Real-time Streaming, ${res.status}, ${errorMessage}`);
    }
  };

  const stopRealTimeStreaming = async () => {
    if (!conference) {
      throw new Error('Tried to stop Real-time Streaming but no conference is available');
    }
    const res = await fetch(`${proxyBaseUrl}/event/stop`, getFetchOptions({ conferenceId: conference.id }));
    if (!res.ok) {
      throw new Error('Could not stop Real-time Streaming');
    }
  };

  return {
    isLive,
    startRealTimeStreaming,
    stopRealTimeStreaming,
  };
};

export default useRealTimeStreaming;
