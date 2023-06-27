import { useMemo } from 'react';

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
  const { conference, participant, participants } = useCommsContext();

  const isLive = useMemo(() => {
    return participants.some((p) => {
      // If the local participant is a listener, a conference is considered live if there is a non-listener participant (the mixer)
      if (participant?.type === 'listener') {
        return participants.some((p) => p.type !== 'listener');
      }
      return p.info.externalId === 'Mixer_rts';
    });
  }, [participant?.type, participants]);

  const startRealTimeStreaming = async () => {
    if (!conference) {
      throw new Error('Tried to start Real-time Streaming but no conference is available');
    }
    const res = await fetch(`${proxyBaseUrl}/event/start`, getFetchOptions({ conferenceId: conference.id }));
    if (!res.ok) {
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
      const errorMessage = await res.json();
      throw new Error(`Could not stop Real-time Streaming, ${res.status}, ${errorMessage}`);
    }
  };

  return {
    isLive,
    startRealTimeStreaming,
    stopRealTimeStreaming,
  };
};

export default useRealTimeStreaming;
