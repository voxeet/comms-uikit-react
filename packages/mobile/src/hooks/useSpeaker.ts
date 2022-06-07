import MediaDevicesService from '../services/mediaDevices';

const useSpeaker = () => {
  const switchSpeaker = () => {
    return MediaDevicesService.switchSpeaker();
  };

  return { switchSpeaker };
};

export default useSpeaker;
