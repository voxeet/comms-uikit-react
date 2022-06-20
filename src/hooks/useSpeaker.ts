import MediaDevicesService from '../services/mediaDevices';

const useSpeaker = () => {
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
