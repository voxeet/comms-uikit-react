import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantToggleVideoButton from './ParticipantToggleVideoButton';

const activeText = 'Camera off';
const inactiveText = 'Camera on';
const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });
const remoteParticipantStatusWithVideo = createParticipantStatus('Remote', { isLocal: false, isVideo: true });
const remoteParticipantStatusWithoutVideo = createParticipantStatus('Remote', { isLocal: false, isVideo: false });

describe('ParticipantToggleVideoButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <ParticipantToggleVideoButton
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
  test('Displays Camera off text props', async () => {
    const { getByText } = render(
      <ParticipantToggleVideoButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithVideo,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(activeText)).not.toBeNull();
    });
  });
  test('Displays Camera on text props', async () => {
    const { getByText } = render(
      <ParticipantToggleVideoButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithoutVideo,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(getByText(inactiveText)).not.toBeNull();
    });
  });

  test('Can click ParticipantToggleVideoButton and runs stopParticipantVideo', async () => {
    const stopRemoteParticipantVideo = jest.fn();

    const { getByTestId } = render(
      <ParticipantToggleVideoButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithVideo,
            },
            stopRemoteParticipantVideo,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(stopRemoteParticipantVideo).toHaveBeenCalled();
    });
  });
  test('Can click ParticipantToggleVideoButton and runs startParticipantVideo', async () => {
    const startRemoteParticipantVideo = jest.fn();

    const { getByTestId } = render(
      <ParticipantToggleVideoButton
        testID={testID}
        participant={remoteParticipant}
        activeTooltipText={activeText}
        inactiveTooltipText={inactiveText}
      />,
      {
        commsProps: {
          value: {
            participantsStatus: {
              ...remoteParticipantStatusWithoutVideo,
            },
            startRemoteParticipantVideo,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(startRemoteParticipantVideo).toHaveBeenCalled();
    });
  });
});
