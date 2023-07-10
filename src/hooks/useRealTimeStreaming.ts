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
  const { conference, participant, participants, recordingData } = useCommsContext();

  const isLive = useMemo(() => {
    // Count the number of mixers - if there are 2 mixers, then the conference is definitley being live streamed.
    const mixers = participants.filter((p) => p.type === 'mixer').length;

    // If the local participant is a listener, a conference is considered live if there is a non-listener participant (the mixer)
    if (participant?.type === 'listener') {
      return participants.some((p) => p.type !== 'listener');
    }
    // two mixers indicates LIVE and RECORDING
    // zero mixers  indicates not live and not recording
    // any other positive number - we need to work out if it's recording or if it's for RTS.
    // short term work around to determine if the event has gone live.
    // The recommended solution to figuring out whether the event is live is to use
    // webhooks. https://docs.dolby.io/communications-apis/docs/webhooks-events-stream-rts-status-updated
    switch (mixers) {
      case 2:
        return true;
      case 1:
        return !recordingData.isRecordingModeActive;
      case 0:
      default:
        // Can there be more than 2 mixers?
        return false;
    }
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
