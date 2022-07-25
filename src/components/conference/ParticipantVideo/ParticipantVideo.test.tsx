import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantVideo from './ParticipantVideo';

const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });

describe('ParticipantVideo component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantVideo participant={remoteParticipant} testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });

  test('Renders fallback when no video stream', () => {
    const { getByTestId } = render(<ParticipantVideo participant={remoteParticipant} testID={testID} />);
    const fallback = getByTestId('FallbackWrapper');
    expect(fallback).not.toBeNull();
  });
});
