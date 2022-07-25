import { render, fireEvent, waitFor } from '../../../utils/tests/test-utils';

import RejoinConferenceButton from './RejoinConferenceButton';

const text = 'rejoin';
const testID = 'testID';

describe('RejoinConferenceButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<RejoinConferenceButton testID={testID} text={text} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Renders text passed as prop', async () => {
    const { getByText } = render(<RejoinConferenceButton testID={testID} text={text} />);
    const regEx = new RegExp(text, 'i');
    await waitFor(() => {
      expect(getByText(regEx)).not.toBeNull();
    });
  });
  test('Can click rejoin button and runs onStart and onSuccess props functions', async () => {
    const onStart = jest.fn();
    const onSuccess = jest.fn();
    const joinConference = jest.fn();
    const openSession = jest.fn();
    const createConference = jest.fn();
    const { getByTestId } = render(
      <RejoinConferenceButton testID={testID} text={text} onStart={onStart} onSuccess={onSuccess} />,
      {
        commsProps: {
          value: {
            prevConference: {
              name: 'conference',
              participant: 'dolby',
            },
            joinConference,
            openSession,
            createConference,
          },
        },
      },
    );
    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(onStart).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(joinConference).toHaveBeenCalled();
      expect(openSession).toHaveBeenCalled();
      expect(createConference).toHaveBeenCalled();
    });
  });
});
