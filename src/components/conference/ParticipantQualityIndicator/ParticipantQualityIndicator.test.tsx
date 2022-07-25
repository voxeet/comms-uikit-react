import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ParticipantQualityIndicator from './ParticipantQualityIndicator';

const testID = 'testID';

const remoteParticipant = createParticipant({ name: 'Remote', id: 'Remote' });
const testNoParticipant = null;

describe('ParticipantQualityIndicator component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ParticipantQualityIndicator participant={remoteParticipant} testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Should be null if no participant', async () => {
    const { queryByTestId } = render(<ParticipantQualityIndicator participant={testNoParticipant} testID={testID} />);

    await waitFor(() => {
      expect(queryByTestId(testID)).toBeNull();
    });
  });
});
