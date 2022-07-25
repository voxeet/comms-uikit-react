import { createConference } from '../../../utils/tests/dataCreators.util';
import { render, waitFor } from '../../../utils/tests/test-utils';

import ConferenceName from './ConferenceName';

const testID = 'testID';
const conferenceName = 'MyConference';

const testConference = createConference({ name: conferenceName, id: conferenceName });

describe('ConferenceName component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ConferenceName testID={testID} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Should display conference name', async () => {
    const { getByText } = render(<ConferenceName testID={testID} />, {
      commsProps: {
        value: {
          conference: testConference,
        },
      },
    });

    await waitFor(() => {
      const element = getByText(conferenceName);
      expect(element).not.toBeNull();
    });
  });
});
