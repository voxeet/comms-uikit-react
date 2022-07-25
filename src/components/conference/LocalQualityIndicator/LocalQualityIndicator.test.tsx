import { render, waitFor } from '../../../utils/tests/test-utils';

import LocalQualityIndicator from './LocalQualityIndicator';

const testID = 'testID';
const testNoParticipant = null;

describe('LocalQualityIndicator component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LocalQualityIndicator testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Should be null if no participant', async () => {
    const { queryByTestId } = render(<LocalQualityIndicator testID={testID} />, {
      commsProps: {
        value: {
          participant: testNoParticipant,
        },
      },
    });

    await waitFor(() => {
      expect(queryByTestId(testID)).toBeNull();
    });
  });
});
