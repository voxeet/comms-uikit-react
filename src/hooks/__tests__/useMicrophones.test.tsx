import MediaDevicesService from '../../services/mediaDevices';
import { waitFor, act, navigatorReturnMock, cleanup, setupHook } from '../../utils/tests/test-utils';
import useMicrophone from '../useMicrophone';

const local1 = { deviceId: '123', label: 'mic' };
const local2 = { deviceId: '321', label: 'mic' };
const defaultMic = { deviceId: 'default', label: 'mic' };
const audioInputDevices = [local1, local2, defaultMic] as MediaDeviceInfo[];
const setLocalMicrophone = jest.fn();

const setup = () =>
  setupHook(useMicrophone, {
    commsProps: {
      value: { localMicrophone: local1, setLocalMicrophone, audioInputDevices },
    },
  });

jest.mock('../../services/mediaDevices', () => {
  return {
    enumerateAudioInputDevices: jest.fn(() => audioInputDevices),
    selectMicrophone: jest.fn(),
    onDeviceListChanged: jest.fn(),
    getSelectedMicrophone: jest.fn(),
  };
});

beforeEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('useMicrophone', () => {
  test('getMicrophones', async () => {
    const hookValues = setup();
    await waitFor(() => {
      expect(hookValues.microphones).toStrictEqual(audioInputDevices);
    });
  });
  test('Should invoke selectSpeaker ', () => {
    const selectMicrophone = jest.fn();
    jest.spyOn(MediaDevicesService, 'selectMicrophone').mockImplementationOnce(selectMicrophone);

    const hookValues = setup();
    hookValues.selectMicrophone(local1.deviceId);
    expect(selectMicrophone).toBeCalledWith(local1.deviceId);
  });
  test('Should get mic permissions', async () => {
    const hookValues = setup();
    await act(async () => {
      const result = await hookValues.getMicrophonePermission();
      expect(result).toBeFalsy();
      const defaultMic = await hookValues.getDefaultLocalMicrophone();
      expect(defaultMic).toBeNull();
    });
    await act(async () => {
      const windowSpy = jest.spyOn(window, 'navigator', 'get');
      const setMediaDevicesSpy = () => windowSpy.mockImplementation(() => navigatorReturnMock({ userAgent: '' }));
      setMediaDevicesSpy();
      const result = await hookValues.getMicrophonePermission();
      expect(result).toBeTruthy();
    });
  });
  test('Should invoke getDefaultMicrophone ', async () => {
    const getSpeakers = jest.fn(() => {
      return Promise.resolve([local1, local2] as MediaDeviceInfo[]);
    });
    const hookValues = setup();
    jest.spyOn(MediaDevicesService, 'enumerateAudioInputDevices').mockImplementationOnce(getSpeakers);
    const resultWithoutDefault = await hookValues.getDefaultLocalMicrophone();
    expect(resultWithoutDefault).toStrictEqual(local1);
    const resultDefault = await hookValues.getDefaultLocalMicrophone();
    expect(resultDefault).toStrictEqual(defaultMic);
  });
});
