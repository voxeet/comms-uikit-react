import MediaDevicesService from '../services/mediaDevices';
import type { UseCamera } from './types/Camera';

const useCamera: UseCamera = () => {
  const getCameras = async () => {
    return (await MediaDevicesService.enumerateVideoInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[];
  };

  const selectCamera = (device: string) => {
    return MediaDevicesService.selectCamera(device);
  };

  const getDefaultLocalCamera = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    let localCamera = null;
    const localCameras = [];

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (device.deviceId === 'default' && device.kind === 'videoinput') {
        localCamera = device;

        break;
      }
      if (device.kind === 'videoinput') {
        localCameras.push(device);
      }
    }
    return localCamera || localCameras[0];
  };

  const getCameraPermission = async () => {
    let permission = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
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
  };
};

export default useCamera;
