import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import { render } from '../../utils/test-utils';

import VideoView from './VideoView';

const testID = 'testID';

const getVideoTracks = jest.fn(() => []);

const participant = {
  _events: {},
  _eventsCount: 0,
  info: {
    name: 'Addie Rhinoceros',
    sdkVersion: '3.4.1',
    avatarUrl: null,
    externalId: null,
  },
  streams: [
    {
      type: 'Camera',
      getVideoTracks,
    },
  ],
  audioQuality: -1,
  audioTransmitting: true,
  _audioReceivingStopped: true,
  id: '532644e4-5103-3911-8e97-6065cb3fe12b',
  status: 'Connected',
  type: 'user',
};

const Component = () => (
  <VideoView testID={testID} participant={participant as unknown as Participant} width={100} height={100} />
);

describe('VideoView component ', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Renders fallback when no video stream', () => {
    const { getByTestId } = render(<Component />);
    const fallback = getByTestId('FallbackWrapper');
    expect(fallback).not.toBeNull();
  });
  test('Renders user fallback', () => {
    const { getByTestId } = render(
      <VideoView
        noVideoFallback={<div data-testid="myFallback" />}
        testID={testID}
        participant={participant as unknown as Participant}
        width={100}
        height={100}
      />,
    );
    const myFallback = getByTestId('myFallback');
    expect(myFallback).not.toBeNull();
  });
});
