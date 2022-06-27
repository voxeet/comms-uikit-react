import MediaDevicesService from '../services/mediaDevices';
import type { UseSpeaker } from './types/Speaker';

const useSpeaker: UseSpeaker = () => {
  const getSpeakers = () => {
    return MediaDevicesService.enumerateAudioOutputDevices() as Promise<MediaDeviceInfo[]>;
  };

  const selectSpeaker = (device: string) => {
    return MediaDevicesService.selectSpeaker(device);
  };

  return {
    getSpeakers,
    selectSpeaker,
  };
};

export default useSpeaker;
