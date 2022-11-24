import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import LeaveConferenceButton from './LeaveConferenceButton';

const text = 'rejoin';
const testID = 'testID';

describe('LeaveConferenceButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<LeaveConferenceButton testID={testID} tooltipText={text} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Renders text in tooltip passed as prop', async () => {
    const { getByText } = render(<LeaveConferenceButton testID={testID} tooltipText={text} />);
    const regEx = new RegExp(text, 'i');
    await waitFor(() => {
      expect(getByText(regEx)).not.toBeNull();
    });
  });
  test('Can click leave button and runs onSuccess prop function and preAction', async () => {
    const onSuccess = jest.fn();
    const preActionMock = jest.fn(() => true);
    const leaveConference = jest.fn();
    const { getByTestId } = render(
      <LeaveConferenceButton testID={testID} tooltipText={text} onSuccess={onSuccess} preAction={preActionMock} />,
      {
        commsProps: {
          value: {
            leaveConference,
          },
        },
      },
    );
    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(onSuccess).toHaveBeenCalled();
      expect(leaveConference).toHaveBeenCalled();
      expect(preActionMock).toHaveBeenCalled();
    });
  });
});
