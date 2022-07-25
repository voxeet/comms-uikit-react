import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import LocalSpeakingIndicator from './LocalSpeakingIndicator';

const testID = 'testID';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatusMuted = createParticipantStatus('Local', {
  isLocal: true,
  isSpeaking: false,
  isLocalAudio: false,
  isRemoteAudio: false,
});
const localParticipantStatusNoSpeak = createParticipantStatus('Local', {
  isLocal: true,
  isSpeaking: false,
  isLocalAudio: true,
  isRemoteAudio: true,
});
const localParticipantStatusSpeaks = createParticipantStatus('Local', {
  isLocal: true,
  isSpeaking: true,
  isLocalAudio: true,
  isRemoteAudio: true,
});

describe('LocalSpeakingIndicator component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LocalSpeakingIndicator testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusMuted,
          },
          isAudio: false,
        },
      },
    });
    await waitFor(() => {
      expect(getByTestId(`${testID}-muted`)).not.toBeNull();
    });
  });
  test('Should display muted indicator when participant is muted', async () => {
    const { getByTestId } = render(<LocalSpeakingIndicator testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusMuted,
          },
          isAudio: false,
        },
      },
    });
    await waitFor(() => {
      const element = getByTestId(`${testID}-muted`);
      expect(element).not.toBeNull();
    });
  });
  test('Should display noSpeaking icon indicator when participant is not muted and does not speaks', async () => {
    const { getByTestId } = render(<LocalSpeakingIndicator testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusNoSpeak,
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
    const { getByTestId } = render(<LocalSpeakingIndicator testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusSpeaks,
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
