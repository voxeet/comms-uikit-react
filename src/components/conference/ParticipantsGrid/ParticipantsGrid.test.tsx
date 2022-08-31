import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantsGrid from './ParticipantsGrid';

const testID = 'testID';
const localText = 'you';
const remoteName = 'Remote';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatus = createParticipantStatus('Local', { isLocal: true });
const remoteParticipant = createParticipant({ name: remoteName, id: 'Remote' });
const remoteParticipantStatus = createParticipantStatus(remoteName, { isLocal: false });

describe('ParticipantsGrid component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantsGrid testID={testID} localText={localText} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participants: [localParticipant],
          participantsStatus: {
            ...localParticipantStatus,
          },
        },
      },
    });

    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Display localText in participant name element', async () => {
    const { getByText } = render(<ParticipantsGrid testID={testID} localText={localText} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participants: [localParticipant, remoteParticipant],
          participantsStatus: {
            ...localParticipantStatus,
            ...remoteParticipantStatus,
          },
        },
      },
    });

    await waitFor(() => {
      expect(getByText(`Local (${localText})`)).not.toBeNull();
    });
  });

  test('Displays two participants with local and remote user', async () => {
    const { getByText } = render(<ParticipantsGrid testID={testID} localText={localText} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participants: [localParticipant, remoteParticipant],
          participantsStatus: {
            ...localParticipantStatus,
            ...remoteParticipantStatus,
          },
        },
      },
    });

    expect(getByText(`Local (${localText})`)).not.toBeNull();
    expect(getByText(remoteName)).not.toBeNull();
  });
});
