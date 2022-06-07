import MediaDevicesService from '../services/mediaDevices';

const useCamera = () => {
  const switchCamera = () => {
    MediaDevicesService.switchCamera();
  };

  return { switchCamera };
};

export default useCamera;
