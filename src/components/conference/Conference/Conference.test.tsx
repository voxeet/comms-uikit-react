import type ConferenceType from '@voxeet/voxeet-web-sdk/types/models/Conference';

import useConference from '../../../hooks/useConference';
import { render, waitFor, screen, cleanup } from '../../../utils/tests/test-utils';

import Conference from './Conference';

const child = 'child';

const alias = 'conference';
const video = true;
const audio = true;
const id = '1234';

const createConference = jest.fn();
const joinConference = jest.fn();
const leaveConference = jest.fn();
const fetchConference = jest.fn();

jest.mock('../../../hooks/useConference', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useConference'),
    createConference,
    joinConference,
    leaveConference: jest.fn(),
  }));
});

beforeEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const useConferenceHookMock = useConference as jest.MockedFunction<typeof useConference>;

const joinParams = {
  constraints: {
    audio,
    video: video
      ? {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        }
      : false,
  },
};

describe('Conference component', () => {
  test('Creates and joins conference with given props and renders child component', async () => {
    render(
      <Conference alias={alias} video={video} audio={audio}>
        {child}
      </Conference>,
    );
    await waitFor(() => {
      expect(createConference).toBeCalledWith({
        alias,
        params: {
          liveRecording: false,
        },
      });
      expect(joinConference).toBeCalledWith(undefined, joinParams);
      expect(screen.getByText(child)).not.toBeNull();
    });
  });
  test('Returns empty and refetch conference when one is already in progress ', async () => {
    useConferenceHookMock.mockImplementation(() => ({
      ...jest.requireActual('../../../hooks/useConference'),
      leaveConference,
      fetchConference,
      joinConference,
      conference: { id: 4321, alias: 'conference2' } as unknown as ConferenceType,
    }));
    render(
      <Conference alias={alias} video={video} audio={audio} id={id}>
        {child}
      </Conference>,
    );
    await waitFor(() => {
      expect(screen.queryByText(child)).toBeNull();
      expect(leaveConference).toBeCalledTimes(1);
      expect(fetchConference).toBeCalledWith('1234');
      expect(joinConference).toBeCalledWith(undefined, joinParams);
    });
  });
  test(`Should not invoke any additional function while actual id is the current one `, async () => {
    useConferenceHookMock.mockImplementation(() => ({
      ...jest.requireActual('../../../hooks/useConference'),
      leaveConference,
      fetchConference,
      joinConference,
      conference: { id: `1234`, alias: 'conference2' } as unknown as ConferenceType,
    }));
    render(
      <Conference alias={alias} video={video} audio={audio} id={id}>
        {child}
      </Conference>,
    );
    await waitFor(() => {
      expect(screen.queryByText(child)).not.toBeNull();
      expect(leaveConference).toBeCalledTimes(0);
      expect(fetchConference).toBeCalledTimes(0);
      expect(joinConference).toBeCalledTimes(0);
    });
  });
});
