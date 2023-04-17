import { cleanup } from '@testing-library/react';

import MediaDevicesService from '../../services/mediaDevices';
import { waitFor, act, navigatorReturnMock, setupHook } from '../../utils/tests/test-utils';
import useCamera from '../useCamera';

const localCamera = { deviceId: '123', label: 'this is one local camera' };
const faceTimeCamera = { deviceId: '12345', label: 'FaceTime' };
const setLocalCamera = jest.fn();
const videoInputDevices = [localCamera, faceTimeCamera] as MediaDeviceInfo[];

const setup = () =>
  setupHook(useCamera, {
    commsProps: {
      value: { localCamera, setLocalCamera, videoInputDevices },
    },
  });

jest.mock('../../services/mediaDevices', () => {
  return {
    enumerateVideoInputDevices: jest.fn(() => [localCamera, { label: 'this one is without deviceId' }, faceTimeCamera]),
    selectCamera: jest.fn(),
    getSelectedCamera: jest.fn(() => localCamera as MediaDeviceInfo),
    onDeviceListChanged: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('useCamera', () => {
  test('getCameras', async () => {
    const hookValues = setup();
    expect(hookValues.cameras).toStrictEqual(videoInputDevices);
  });
  test('Should invoke selectCamera ', () => {
    const selectCamera = jest.fn();
    jest.spyOn(MediaDevicesService, 'selectCamera').mockImplementation(selectCamera);
    const hookValues = setup();
    hookValues.selectCamera(faceTimeCamera.deviceId);
    waitFor(() => {
      expect(selectCamera).toBeCalledWith(faceTimeCamera.deviceId);
    });
  });
  test('Should invoke getDefaultLocalCamera ', async () => {
    const defaultCamera = { deviceId: 'default', label: 'default' };
    const getCameras = jest.fn(() => {
      return Promise.resolve([
        localCamera,
        defaultCamera,
        { label: 'this one is without deviceId' },
      ] as MediaDeviceInfo[]);
    });
    const hookValues = setup();
    jest.spyOn(MediaDevicesService, 'enumerateVideoInputDevices').mockImplementationOnce(getCameras);
    const resultDefault = await hookValues.getDefaultLocalCamera();
    expect(resultDefault).toStrictEqual(defaultCamera);
    const resultWithoutDefault = await hookValues.getDefaultLocalCamera();
    expect(resultWithoutDefault).toStrictEqual(localCamera);
  });

  test('Should get camera permissions', async () => {
    const hookValues = setup();
    await act(async () => {
      const result = await hookValues.getCameraPermission();
      expect(result).toBeFalsy();
    });
    await act(async () => {
      const windowSpy = jest.spyOn(window, 'navigator', 'get');
      const setMediaDevicesSpy = () => windowSpy.mockImplementation(() => navigatorReturnMock({ userAgent: '' }));
      setMediaDevicesSpy();
      const result = await hookValues.getCameraPermission();
      expect(result).toBeTruthy();
    });
  });

  test('Should swap cameras', async () => {
    const hookValues = setup();
    await hookValues.swapCamera();
    await waitFor(() => {
      expect(setLocalCamera).toBeCalledWith(faceTimeCamera);
    });
  });
});
