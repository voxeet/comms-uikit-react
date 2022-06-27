import MediaDevicesService from '../services/mediaDevices';
import type { UseMicrophone } from './types/Microphone';

const useMicrophone: UseMicrophone = () => {
  const getMicrophones = async () => {
    return (await MediaDevicesService.enumerateAudioInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[];
  };

  const selectMicrophone = (device: string) => {
    return MediaDevicesService.selectMicrophone(device);
  };

  const getMicrophonePermission = async () => {
    let permission = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
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
    getMicrophones,
    selectMicrophone,
    getMicrophonePermission,
  };
};

export default useMicrophone;
