import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import MediaDevicesService from '../services/mediaDevices';

import type { UseSpeaker } from './types/Speaker';

const useSpeaker: UseSpeaker = () => {
  const { localSpeakers, setLocalSpeakers } = useContext(CommsContext);
  const getSpeakers = () => {
    return MediaDevicesService.enumerateAudioOutputDevices() as Promise<MediaDeviceInfo[]>;
  };

  const getDefaultLocalSpeaker = async () => {
    const devices = await MediaDevicesService.enumerateAudioOutputDevices();
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (device.deviceId === 'default') {
        return device;
      }
    }
    return null;
  };

  const selectSpeaker = (device: string) => {
    return MediaDevicesService.selectSpeaker(device);
  };

  return {
    getSpeakers,
    selectSpeaker,
    localSpeakers,
    setLocalSpeakers,
    getDefaultLocalSpeaker,
  };
};

export default useSpeaker;
