import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import MediaDevicesService from '../services/mediaDevices';

const useCamera = () => {
  const { isVideo, toggleVideo } = useContext(CommsContext);

  const getCameras = async () => {
    return (await MediaDevicesService.enumerateVideoDevices()).filter((d) => d.deviceId) as InputDeviceInfo[];
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

  const hasCameraPermission = async () => {
    let permission = false;
    const cameras = await getCameras();
    for (let i = 0; i < cameras.length; i++) {
      const camera = cameras[i];
      if (camera.label.length > 0) {
        permission = true;
      }
    }
    return permission;
  };

  return { getCameras, selectCamera, isVideo, toggleVideo, getDefaultLocalCamera, hasCameraPermission };
};

export default useCamera;
