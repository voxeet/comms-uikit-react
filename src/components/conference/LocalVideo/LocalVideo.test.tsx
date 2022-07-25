import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import LocalVideo from './LocalVideo';

const testID = 'testID';

const localParticipant = createParticipant({ name: 'Local', id: 'Local' });

describe('LocalVideo component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LocalVideo testID={testID} />);

    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });

  test('Renders fallback when no video stream', () => {
    const { getByTestId } = render(<LocalVideo testID={testID} />, {
      commsProps: {
        value: {
          participant: localParticipant,
        },
      },
    });
    const fallback = getByTestId('FallbackWrapper');
    expect(fallback).not.toBeNull();
  });
});
