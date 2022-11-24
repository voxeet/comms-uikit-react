import MediaDevicesService from '../../services/mediaDevices';
import { setupHook } from '../../utils/tests/test-utils';
import useSpeaker from '../useSpeaker';

const local1 = { deviceId: '123', label: 'this is one local speaker' };
const local2 = { deviceId: '321', label: 'this is one local speaker' };
const defaultSpeaker = { deviceId: 'default', label: 'this is one local speaker' };
const speakers = [local1, local2, defaultSpeaker];
const setLocalSpeakers = jest.fn();

const setup = () =>
  setupHook(useSpeaker, {
    commsProps: {
      value: { localSpeakers: local1, setLocalSpeakers },
    },
  });

jest.mock('../../services/mediaDevices', () => {
  return {
    enumerateAudioOutputDevices: jest.fn(() => speakers),
    selectSpeaker: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSpeakers', () => {
  test('getSpeakers', async () => {
    const hookValues = setup();
    const cameras = await hookValues.getSpeakers();
    expect(cameras).toStrictEqual(speakers);
  });
  test('Should invoke selectSpeaker ', () => {
    const selectSpeaker = jest.fn();
    jest.spyOn(MediaDevicesService, 'selectSpeaker').mockImplementationOnce(selectSpeaker);

    const hookValues = setup();
    hookValues.selectSpeaker(local1.deviceId);
    expect(selectSpeaker).toBeCalledWith(local1.deviceId);
  });

  test('Should invoke getDefaultLocalSpeaker ', async () => {
    const getSpeakers = jest.fn(() => {
      return Promise.resolve([local1, local2] as MediaDeviceInfo[]);
    });
    const hookValues = setup();
    jest.spyOn(MediaDevicesService, 'enumerateAudioOutputDevices').mockImplementationOnce(getSpeakers);
    const resultWithoutDefault = await hookValues.getDefaultLocalSpeaker();
    expect(resultWithoutDefault).toBeNull();
    const resultDefault = await hookValues.getDefaultLocalSpeaker();
    expect(resultDefault).toStrictEqual(defaultSpeaker);
  });
});
