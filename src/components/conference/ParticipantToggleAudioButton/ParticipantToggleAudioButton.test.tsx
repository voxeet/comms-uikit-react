import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantToggleAudioButton from './ParticipantToggleAudioButton';

const activeText = 'Volume off';
const inactiveText = 'Volume on';
const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });
const remoteParticipantStatusWithAudio = createParticipantStatus('Remote', { isLocal: false, isLocalAudio: true });
const remoteParticipantStatusWithoutAudio = createParticipantStatus('Remote', { isLocal: false, isLocalAudio: false });
const remoteParticipantStatusRemoteMuted = createParticipantStatus('Remote', {
  isLocal: false,
  isLocalAudio: true,
  isRemoteAudio: false,
});

describe('ParticipantToggleAudioButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
    );
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays Volume off text props', async () => {
    const { getByText } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(activeText)).not.toBeNull();
    });
  });
  test('Displays Volume on text props', async () => {
    const { getByText } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithoutAudio,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(inactiveText)).not.toBeNull();
    });
  });
  test('Should button be disabled if participant is remotely muted', async () => {
    const { getByTestId } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusRemoteMuted,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByTestId(testID)).toBeDisabled();
    });
  });
  test('Can click ParticipantToggleAudioButton and runs stopParticipantAudio', async () => {
    const stopParticipantAudio = jest.fn();

    const { getByTestId } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithAudio,
            },
            stopParticipantAudio,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(stopParticipantAudio).toHaveBeenCalled();
    });
  });
  test('Can click ParticipantToggleAudioButton and runs startParticipantAudio', async () => {
    const startParticipantAudio = jest.fn();

    const { getByTestId } = render(
      <ParticipantToggleAudioButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithoutAudio,
            },
            startParticipantAudio,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(startParticipantAudio).toHaveBeenCalled();
    });
  });
});
