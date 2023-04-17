import type ConferenceType from '@voxeet/voxeet-web-sdk/types/models/Conference';

import useConference from '../../../hooks/useConference';
import { fireEvent, render, waitFor } from '../../../utils/tests/test-utils';

import JoinConferenceButton from './JoinConferenceButton';

const joinOptions = { constraints: { audio: true, video: true } };
const meetingName = 'test-conference';
const text = 'join';
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

const useConferenceHookMock = useConference as jest.MockedFunction<typeof useConference>;

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
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(onSuccess).toHaveBeenCalled();
      expect(joinConference).toHaveBeenCalled();
    });
  });
  test('Should invoke onError callback ', async () => {
    const onError = jest.fn();
    const rejectedJoin = jest.fn(() => Promise.reject(new Error('ERROR')));
    useConferenceHookMock.mockImplementation(() => ({
      ...jest.requireActual('../../../hooks/useConference'),
      createConference,
      joinConference: rejectedJoin,
      conference: { id: 4321, alias: 'conference2' } as unknown as ConferenceType,
    }));
    const { getByTestId } = render(
      <JoinConferenceButton
        joinOptions={joinOptions}
        meetingName={meetingName}
        testID={testID}
        tooltipText={text}
        onError={onError}
      />,
    );

    await waitFor(() => {
      const element = getByTestId(testID);
      fireEvent.click(element);
      expect(rejectedJoin).toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });
});
