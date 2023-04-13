import MediaDevicesService from '../services/mediaDevices';

import type { UseSpeaker } from './types/Speaker';
import useCommsContext from './useCommsContext';

const useSpeaker: UseSpeaker = () => {
  const { localSpeakers, setLocalSpeakers, audioOutputDevices, setAudioOutputDevices } = useCommsContext();
  const getSpeakers = async () => {
    setAudioOutputDevices((await MediaDevicesService.enumerateAudioOutputDevices()) as MediaDeviceInfo[]);
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

  const getSelectedSpeaker = () => {
    return MediaDevicesService.getSelectedSpeaker();
  };

  const selectSpeaker = async (device: string) => {
    const selectedDevice = getSelectedSpeaker();
    if (device !== selectedDevice?.deviceId) {
      return MediaDevicesService.selectSpeaker(device);
    }
    return device;
  };

  return {
    speakers: audioOutputDevices,
    getSpeakers,
    selectSpeaker,
    localSpeakers,
    setLocalSpeakers,
    getDefaultLocalSpeaker,
    getSelectedSpeaker,
  };
};

export default useSpeaker;
