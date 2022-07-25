import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import MediaDevicesService from '../services/mediaDevices';

import type { UseCamera } from './types/Camera';

const useCamera: UseCamera = () => {
  const { localCamera, setLocalCamera } = useContext(CommsContext);
  const getCameras = async () => {
    return (await MediaDevicesService.enumerateVideoInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[];
  };

  const selectCamera = (device: string) => {
    return MediaDevicesService.selectCamera(device);
  };

  const getDefaultLocalCamera = async () => {
    const devices = await MediaDevicesService.enumerateVideoInputDevices();
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (device.deviceId === 'default') {
        return device;
      }
    }
    return null;
  };

  const getCameraPermission = async () => {
    let permission = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      });

      if (stream) {
        permission = true;
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    } catch (error) {
      permission = false;
    }
    return permission;
  };

  return {
    getCameras,
    selectCamera,
    getDefaultLocalCamera,
    getCameraPermission,
    localCamera,
    setLocalCamera,
  };
};

export default useCamera;
