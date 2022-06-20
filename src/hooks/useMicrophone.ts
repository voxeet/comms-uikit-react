import MediaDevicesService from '../services/mediaDevices';

const useMicrophone = () => {
  const getMicrophones = async () => {
    return (await MediaDevicesService.enumerateAudioInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[];
  };

  const selectMicrophone = (device: string) => {
    return MediaDevicesService.selectMicrophone(device);
  };

  const hasMicrophonePermission = async () => {
    let permission = false;
    const microphones = await getMicrophones();
    for (let i = 0; i < microphones.length; i++) {
      const mic = microphones[i];
      if (mic.label.length > 0) {
        permission = true;
      }
    }
    return permission;
  };

  return {
    getMicrophones,
    selectMicrophone,
    hasMicrophonePermission,
  };
};

export default useMicrophone;
