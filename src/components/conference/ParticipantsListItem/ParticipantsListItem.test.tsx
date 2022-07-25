import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantsListItem from './ParticipantsListItem';

const testID = 'testID';
const localText = 'you';
const muteText = 'mute';
const unmuteText = 'unmute';
const soundOnText = 'soundOn';
const soundOffText = 'soundOff';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatusWithAudio = createParticipantStatus('Local', { isLocal: true, isLocalAudio: true });
const localParticipantStatusWithoutAudio = createParticipantStatus('Local', { isLocal: true, isLocalAudio: false });

jest.mock('../../../hooks/useMicrophone', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useMicrophone'),
    getMicrophonePermission: jest.fn(() => true),
  }));
});

describe('ParticipantsListItem component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <ParticipantsListItem
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
        participant={localParticipant}
      />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participants: [localParticipant],
            participantsStatus: {
              ...localParticipantStatusWithAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays localText for local user', async () => {
    const { getByText } = render(
      <ParticipantsListItem
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
        participant={localParticipant}
      />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participants: [localParticipant],
            participantsStatus: {
              ...localParticipantStatusWithAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      const localRegEx = new RegExp(localText, 'i');
      expect(getByText(localRegEx)).not.toBeNull();
    });
  });
  test('Displays mute text props', async () => {
    const { getByText } = render(
      <ParticipantsListItem
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
        participant={localParticipant}
      />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participants: [localParticipant],
            participantsStatus: {
              ...localParticipantStatusWithAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      const muteRegEx = new RegExp(muteText, 'i');
      expect(getByText(muteRegEx)).not.toBeNull();
    });
  });
  test('Displays unmute text props', async () => {
    const { getByText } = render(
      <ParticipantsListItem
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
        participant={localParticipant}
      />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participants: [localParticipant],
            participantsStatus: {
              ...localParticipantStatusWithoutAudio,
            },
            isAudio: false,
          },
        },
      },
    );
    await waitFor(() => {
      const unmuteRegEx = new RegExp(unmuteText, 'i');
      expect(getByText(unmuteRegEx)).not.toBeNull();
    });
  });
});
