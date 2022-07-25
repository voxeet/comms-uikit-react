import { defaultTheme as theme } from '../../../common';

import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantName from './ParticipantName';

const testID = 'testID';

const { colors } = theme;

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });

const remoteParticipantStatusWithIsSpeaking = createParticipantStatus('Remote', { isLocal: false, isSpeaking: true });

describe('ParticipantName component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantName participant={remoteParticipant} testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });

  test('Should display text as name of participant', async () => {
    const { getByTestId } = render(<ParticipantName participant={remoteParticipant} testID={testID} />);

    await waitFor(() => {
      expect(getByTestId(`${testID}-text`)).toHaveTextContent(`${remoteParticipant.info.name}`);
    });
  });
  test('Should render in speaking style', async () => {
    const { getByTestId } = render(<ParticipantName participant={remoteParticipant} testID={testID} />, {
      commsProps: {
        value: {
          participantsStatus: {
            ...remoteParticipantStatusWithIsSpeaking,
          },
        },
      },
    });
    await waitFor(() => {
      expect(getByTestId(testID)).toHaveStyle(`background: ${colors.white}`);
    });
  });
});
