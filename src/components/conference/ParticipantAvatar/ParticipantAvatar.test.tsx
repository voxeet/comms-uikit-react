import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantAvatar from './ParticipantAvatar';

const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Local', id: 'Local' });

describe('ParticipantAvatar component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantAvatar participant={remoteParticipant} testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays first letter of participant name', async () => {
    const { getByTestId } = render(<ParticipantAvatar participant={remoteParticipant} testID={testID} />);

    await waitFor(() => {
      const textElement = getByTestId(`${testID}-text`);
      expect(textElement).toHaveTextContent(`${remoteParticipant.info.name?.charAt(0).toUpperCase()}`);
    });
  });
});
