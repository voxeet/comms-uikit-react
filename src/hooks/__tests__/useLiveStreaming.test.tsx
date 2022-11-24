import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import type { CommsProviderProps } from '../../providers/CommsProvider';
import { setupHook } from '../../utils/tests/test-utils';
import { Status } from '../types/misc';
import useLiveStreaming from '../useLiveStreaming';

const differentUser = { id: '2' } as Participant;

const owner = { id: '1' } as Participant;
const timestamp = 1;
const status = Status.Other;
const isLiveStreamingModeActive = false;
const provider = null;

const testLiveStreamingData = {
  owner,
  timestamp,
  status,
  isLiveStreamingModeActive,
  provider,
};

const setup = (commsProps?: Partial<CommsProviderProps>) => {
  return setupHook(useLiveStreaming, {
    commsProps: {
      value: { participant: owner, liveStreamingData: testLiveStreamingData, ...commsProps?.value },
    },
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useLiveStreaming', () => {
  test('consumes liveStreamingData', () => {
    const hookValues = setup();
    expect(hookValues.owner).toEqual(owner);
    expect(hookValues.timestamp).toEqual(timestamp);
    expect(hookValues.status).toEqual(status);
    expect(hookValues.isLiveStreamingModeActive).toEqual(isLiveStreamingModeActive);
    expect(hookValues.provider).toEqual(provider);
  });
  test('isLocalUserLiveStreamingOwner is defining properly', () => {
    const hookValues = setup();
    expect(hookValues.isLocalUserLiveStreamingOwner).toEqual(true);
    const newHookValues = setup({ value: { participant: differentUser } });
    expect(newHookValues.isLocalUserLiveStreamingOwner).toEqual(false);
  });
});
