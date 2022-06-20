import MediaDevicesService from '../services/mediaDevices';

const useCamera = () => {
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

  return {
    getCameras,
    selectCamera,
    getDefaultLocalCamera,
    hasCameraPermission,
  };
};

export default useCamera;
