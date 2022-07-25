import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import LocalToggleAudioButton from './LocalToggleAudioButton';

const activeText = 'Mute';
const inactiveText = 'Unmute';
const testID = 'testID';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatusWithAudio = createParticipantStatus('Local', { isLocal: true, isLocalAudio: true });
const localParticipantStatusWithoutAudio = createParticipantStatus('Local', { isLocal: true, isLocalAudio: false });

jest.mock('../../../hooks/useMicrophone', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useMicrophone'),
    getMicrophonePermission: jest.fn(() => true),
  }));
});

describe('LocalToggleAudioButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <LocalToggleAudioButton testID={testID} activeTooltipText={activeText} inactiveTooltipText={inactiveText} />,
    );
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays mute text props', async () => {
    const { getByText } = render(
      <LocalToggleAudioButton testID={testID} activeTooltipText={activeText} inactiveTooltipText={inactiveText} />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participantsStatus: {
              ...localParticipantStatusWithAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(activeText)).not.toBeNull();
    });
  });
  test('Displays unmute text props', async () => {
    const { getByText } = render(
      <LocalToggleAudioButton testID={testID} activeTooltipText={activeText} inactiveTooltipText={inactiveText} />,
      {
        commsProps: {
          value: {
            participant: localParticipant,
            participantsStatus: {
              ...localParticipantStatusWithoutAudio,
            },
            isAudio: false,
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(inactiveText)).not.toBeNull();
    });
  });
  test('Can click LocalToggleAudioButton and runs toggleAudio function', async () => {
    const toggleAudio = jest.fn();

    const { getByTestId } = render(
      <LocalToggleAudioButton testID={testID} activeTooltipText={activeText} inactiveTooltipText={inactiveText} />,
      {
        commsProps: {
          value: {
            toggleAudio,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(toggleAudio).toHaveBeenCalled();
    });
  });
});
