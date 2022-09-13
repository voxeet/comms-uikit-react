import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantsGridItem from './ParticipantsGridItem';

const testID = 'ParticipantsGridItem';
const localText = 'you';
const remoteUserName = 'Remote';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const remoteParticipant = createParticipant({ name: remoteUserName, id: remoteUserName });
const localParticipantStatusSpeaking = createParticipantStatus('Local', {
  isLocal: true,
  isLocalAudio: true,
  isSpeaking: true,
  isRemoteAudio: true,
});
const remoteParticipantStatusMuted = createParticipantStatus(remoteUserName, {
  isLocal: false,
  isLocalAudio: false,
  isRemoteAudio: false,
});

describe('ParticipantsGridItem component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantsGridItem localText={localText} participant={localParticipant} />, {});
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays localText for local user and indicates speaking', async () => {
    const { getByText, getByTestId } = render(
      <ParticipantsGridItem localText={localText} participant={localParticipant} />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participantsStatus: {
              ...localParticipantStatusSpeaking,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(`(${localText})`)).not.toBeNull();
      expect(getByTestId('LocalSpeakingIndicator-speaking')).not.toBeNull();
    });
  });
  test('Displays remote user name and indicates muted state', async () => {
    const { getByText, getByTestId } = render(
      <ParticipantsGridItem localText={localText} participant={remoteParticipant} />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusMuted,
            },
          },
        },
      },
    );
    await waitFor(() => {
      const nameElement = getByText(remoteUserName);
      expect(nameElement).not.toBeNull();
      expect(getByTestId('ParticipantSpeakingIndicator-muted')).not.toBeNull();
    });
  });
});
