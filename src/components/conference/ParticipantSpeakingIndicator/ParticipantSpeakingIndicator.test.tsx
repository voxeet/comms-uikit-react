import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantSpeakingIndicator from './ParticipantSpeakingIndicator';

const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });
const remoteParticipantStatusMuted = createParticipantStatus('Remote', {
  isLocal: false,
  isSpeaking: false,
  isLocalAudio: false,
  isRemoteAudio: false,
});
const remoteParticipantStatusNoSpeak = createParticipantStatus('Remote', {
  isLocal: false,
  isSpeaking: false,
  isLocalAudio: true,
  isRemoteAudio: true,
});
const remoteParticipantStatusSpeaks = createParticipantStatus('Remote', {
  isLocal: false,
  isSpeaking: true,
  isLocalAudio: true,
  isRemoteAudio: true,
});

describe('ParticipantSpeakingIndicator component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantSpeakingIndicator participant={remoteParticipant} testID={testID} />, {
      commsProps: {
        value: {
          participantsStatus: {
            ...remoteParticipantStatusMuted,
          },
        },
      },
    });
    await waitFor(() => {
      expect(getByTestId(`${testID}-muted`)).not.toBeNull();
    });
  });
  test('Should display muted indicator when participant is muted', async () => {
    const { getByTestId } = render(<ParticipantSpeakingIndicator participant={remoteParticipant} testID={testID} />, {
      commsProps: {
        value: {
          participantsStatus: {
            ...remoteParticipantStatusMuted,
          },
        },
      },
    });
    await waitFor(() => {
      const element = getByTestId(`${testID}-muted`);
      expect(element).not.toBeNull();
    });
  });
  test('Should display noSpeaking icon indicator when participant is not muted and does not speaks', async () => {
    const { getByTestId } = render(<ParticipantSpeakingIndicator participant={remoteParticipant} testID={testID} />, {
      commsProps: {
        value: {
          participantsStatus: {
            ...remoteParticipantStatusNoSpeak,
          },
        },
      },
    });
    await waitFor(() => {
      const element = getByTestId(`${testID}-noSpeaking`);
      expect(element).not.toBeNull();
    });
  });
  test('Should display speaking indicator when participant is not muted and speaks', async () => {
    const { getByTestId } = render(<ParticipantSpeakingIndicator participant={remoteParticipant} testID={testID} />, {
      commsProps: {
        value: {
          participantsStatus: {
            ...remoteParticipantStatusSpeaks,
          },
        },
      },
    });
    await waitFor(() => {
      const element = getByTestId(`${testID}-speaking`);
      expect(element).not.toBeNull();
    });
  });
});
