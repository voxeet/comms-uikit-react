import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import MediaDevicesService from '../services/mediaDevices';

import type { UseMicrophone } from './types/Microphone';

const useMicrophone: UseMicrophone = () => {
  const { localMicrophone, setLocalMicrophone } = useContext(CommsContext);
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

  const getDefaultLocalMicrophone = async () => {
    const devices = await MediaDevicesService.enumerateAudioInputDevices();
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (device.deviceId === 'default') {
        return device;
      }
    }
    return null;
  };

  return {
    getMicrophones,
    selectMicrophone,
    getMicrophonePermission,
    localMicrophone,
    setLocalMicrophone,
    getDefaultLocalMicrophone,
  };
};

export default useMicrophone;
