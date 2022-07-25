import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render } from '../../../utils/tests/test-utils';

import ParticipantsList from './ParticipantsList';

const testID = 'testID';
const localText = 'you';
const muteText = 'mute';
const unmuteText = 'unmute';
const soundOnText = 'soundOn';
const soundOffText = 'soundOff';
const remoteUsername = 'Remote';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatus = createParticipantStatus('Local', { isLocal: true });
const remoteParticipant = createParticipant({ name: remoteUsername, id: remoteUsername });
const remoteParticipantStatus = createParticipantStatus(remoteUsername, { isLocal: false });

describe('ParticipantsList component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <ParticipantsList
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
      />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays localText for local user', async () => {
    const { getByText } = render(
      <ParticipantsList
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
      />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participants: [localParticipant],
            participantsStatus: {
              ...localParticipantStatus,
            },
          },
        },
      },
    );
    const localRegEx = new RegExp(localText, 'i');
    expect(getByText(localRegEx)).not.toBeNull();
  });
  test('Displays two participants with local and remote user', async () => {
    const { getByText } = render(
      <ParticipantsList
        testID={testID}
        localText={localText}
        muteText={muteText}
        unmuteText={unmuteText}
        soundOnText={soundOnText}
        soundOffText={soundOffText}
      />,
      {
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
      },
    );
    const localRegEx = new RegExp(localText, 'i');
    const remoteRegEx = new RegExp(remoteUsername, 'i');
    expect(getByText(localRegEx)).not.toBeNull();
    expect(getByText(remoteRegEx)).not.toBeNull();
  });
});
