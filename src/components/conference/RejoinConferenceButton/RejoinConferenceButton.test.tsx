import { render, fireEvent, waitFor } from '../../../utils/tests/test-utils';

import RejoinConferenceButton from './RejoinConferenceButton';

const text = 'rejoin';
const testID = 'testID';

const joinOptions = {
  constraints: {
    audio: true,
    video: true,
  },
};

describe('RejoinConferenceButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<RejoinConferenceButton testID={testID} text={text} joinOptions={joinOptions} />);
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });
  test('Renders text passed as prop', async () => {
    const { getByText } = render(<RejoinConferenceButton testID={testID} text={text} joinOptions={joinOptions} />);
    const regEx = new RegExp(text, 'i');
    await waitFor(() => {
      expect(getByText(regEx)).not.toBeNull();
    });
  });
  test('Can click rejoin button and runs onStart and onSuccess props functions', async () => {
    const onStart = jest.fn();
    const onSuccess = jest.fn();
    const joinConference = jest.fn();
    const createConference = jest.fn();
    const { getByTestId } = render(
      <RejoinConferenceButton
        testID={testID}
        text={text}
        onStart={onStart}
        onSuccess={onSuccess}
        joinOptions={joinOptions}
      />,
      {
        commsProps: {
          value: {
            prevConference: {
              name: 'conference',
              participant: 'dolby',
            },
            joinConference,
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
      expect(createConference).toHaveBeenCalled();
    });
  });
});
