import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import JoinConferenceButton from './JoinConferenceButton';

const joinOptions = { constraints: { audio: true, video: true } };
const meetingName = 'test-conference';
const text = 'rejoin';
const testID = 'testID';

const openSession = jest.fn();
const createConference = jest.fn().mockReturnValue({ id: '' });
const joinConference = jest.fn();

jest.mock('../../../hooks/useSession', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useSession'),
    openSession,
  }));
});

jest.mock('../../../hooks/useConference', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useConference'),
    createConference,
    joinConference,
  }));
});

describe('JoinConferenceButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <JoinConferenceButton joinOptions={joinOptions} meetingName={meetingName} testID={testID} tooltipText={text} />,
    );
    await waitFor(() => {
      expect(getByTestId(testID)).not.toBeNull();
    });
  });

  test('Renders text in tooltip passed as prop', async () => {
    const { getByText } = render(
      <JoinConferenceButton joinOptions={joinOptions} meetingName={meetingName} testID={testID} tooltipText={text} />,
    );
    const regEx = new RegExp(text, 'i');
    await waitFor(() => {
      expect(getByText(regEx)).not.toBeNull();
    });
  });

  test('Can click leave button and runs onSuccess prop function', async () => {
    const onSuccess = jest.fn();

    const { getByTestId } = render(
      <JoinConferenceButton
        joinOptions={joinOptions}
        meetingName={meetingName}
        testID={testID}
        tooltipText={text}
        onSuccess={onSuccess}
      />,
      {
        commsProps: {
          value: {
            joinConference,
          },
        },
      },
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(onSuccess).toHaveBeenCalled();
      expect(joinConference).toHaveBeenCalled();
    });
  });
});
