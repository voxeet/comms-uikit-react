import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import LocalAvatar from './LocalAvatar';

const testID = 'testID';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });

describe('LocalAvatar component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LocalAvatar testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Displays first letter of participant name', async () => {
    const { getByTestId } = render(<LocalAvatar testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
        },
      },
    });

    await waitFor(() => {
      const textElement = getByTestId(`${testID}-text`);
      expect(textElement).toHaveTextContent(`${localParticipant.info.name?.charAt(0).toUpperCase()}`);
    });
  });
});
