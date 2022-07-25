import { defaultTheme as theme } from '../../../common';

import { createParticipant, createParticipantStatus } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import LocalName from './LocalName';

const localUserText = 'You';
const testID = 'testID';

const { colors } = theme;

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });
const localParticipantStatusWithoutIsSpeaking = createParticipantStatus('Local', { isLocal: true, isSpeaking: false });
const localParticipantStatusWithIsSpeaking = createParticipantStatus('Local', { isLocal: true, isSpeaking: true });

describe('LocalName component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LocalName testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Should display text You and render in no speaking style', async () => {
    const { getByText, getByTestId } = render(<LocalName testID={testID} text={localUserText} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusWithoutIsSpeaking,
          },
        },
      },
    });
    await waitFor(() => {
      expect(getByText(localUserText)).not.toBeNull();
      expect(getByTestId(testID)).not.toHaveStyle(`background: ${colors.white}`);
    });
  });
  test('Should display text as name of participant and render in speaking style', async () => {
    const { getByTestId } = render(<LocalName testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
          participantsStatus: {
            ...localParticipantStatusWithIsSpeaking,
          },
        },
      },
    });
    await waitFor(() => {
      expect(getByTestId(`${testID}-text`)).toHaveTextContent(`${localParticipant.info.name}`);
      expect(getByTestId(testID)).toHaveStyle(`background: ${colors.white}`);
    });
  });
});
