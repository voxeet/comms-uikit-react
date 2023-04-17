import { ErrorCodes } from '../providers/CommsProvider';
import MediaDevicesService from '../services/mediaDevices';

import type { UseCamera } from './types/Camera';
import useCommsContext from './useCommsContext';
import useTheme from './useTheme';

const defaultCameras = ['default'];

const useCamera: UseCamera = () => {
  const {
    localCamera,
    setLocalCamera,
    hasCameraPermission,
    setHasCameraPermission,
    startLocalVideo,
    stopLocalVideo,
    errors,
    removeError,
    videoInputDevices,
    setVideoInputDevices,
  } = useCommsContext();

  const { isDesktop } = useTheme();
  const getCameras = async () => {
    setVideoInputDevices(
      (await MediaDevicesService.enumerateVideoInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[],
    );
  };

  const getSelectedCamera = () => {
    return MediaDevicesService.getSelectedCamera();
  };

  const selectCamera = async (device: string) => {
    const selectedDevice = getSelectedCamera();
    if (device !== selectedDevice?.deviceId) {
      return MediaDevicesService.selectCamera(device);
    }
    return Promise.resolve(device);
  };

  const getDefaultLocalCamera = async () => {
    const devices = await MediaDevicesService.enumerateVideoInputDevices();
    if (!isDesktop && devices.length) {
      return devices[0];
    }
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      if (defaultCameras.includes(device.deviceId)) {
        return device;
      }
    }
    if (devices.length > 1) {
      /*
       * For sake of using external cameras as default we need to exclude FaceTime from default cameras pool ,
       * Safari integration is picking FaceTime cameras (always labelled FaceTime) as default
       */
      const devicesWithoutFaceTimeCameras = devices.filter((device) => !device.label.includes('FaceTime'));
      return devicesWithoutFaceTimeCameras[0];
    }
    return devices[0] || null;
  };

  const getCameraPermission = async () => {
    let permission = hasCameraPermission;
    if (!hasCameraPermission) {
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
      setHasCameraPermission(permission);
    }
    return permission;
  };

  const swapCamera = async () => {
    if (!localCamera) {
      return setLocalCamera(videoInputDevices[1]);
    }
    const activeCameraIndex = videoInputDevices.findIndex((camera) => localCamera.deviceId === camera.deviceId);
    const swap: MediaDeviceInfo =
      videoInputDevices[activeCameraIndex === videoInputDevices.length - 1 ? 0 : activeCameraIndex + 1];
    return setLocalCamera(swap);
  };

  return {
    cameras: videoInputDevices,
    getCameras,
    selectCamera,
    getDefaultLocalCamera,
    getCameraPermission,
    localCamera,
    setLocalCamera,
    swapCamera,
    startLocalVideo,
    stopLocalVideo,
    videoError: !!errors.mediaDevicesErrors.CorruptedVideoTrack,
    removeError: () => removeError({ error: ErrorCodes.CorruptedVideoTrack }),
    getSelectedCamera,
  };
};

export default useCamera;
