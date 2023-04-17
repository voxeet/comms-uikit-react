import { useEffect } from 'react';

import MediaDevicesService from '../services/mediaDevices';

import type { UseMicrophone } from './types/Microphone';
import useCommsContext from './useCommsContext';
import useTheme from './useTheme';

const defaultMics = ['default'];

const useMicrophone: UseMicrophone = () => {
  const {
    localMicrophone,
    setLocalMicrophone,
    hasMicrophonePermission,
    setHasMicrophonePermission,
    audioInputDevices,
    setAudioInputDevices,
  } = useCommsContext();
  const { isDesktop } = useTheme();

  const getMicrophones = async () => {
    /*
     * Additional refreshing for permissions on Firefox due to assumption of lack of permissions bug
     */
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    setAudioInputDevices(
      (await MediaDevicesService.enumerateAudioInputDevices()).filter((d) => d.deviceId) as MediaDeviceInfo[],
    );
  };

  const getSelectedMicrophone = () => {
    return MediaDevicesService.getSelectedMicrophone();
  };

  const selectMicrophone = async (device: string) => {
    const selectedDevice = getSelectedMicrophone();
    if (device !== selectedDevice?.deviceId) {
      return MediaDevicesService.selectMicrophone(device);
    }
    return device;
  };

  const getMicrophonePermission = async () => {
    let permission = hasMicrophonePermission;
    if (!hasMicrophonePermission) {
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
      setHasMicrophonePermission(permission);
    }
    return permission;
  };

  useEffect(() => {
    if (!localMicrophone) {
      (async () => {
        const defaultMic = await getDefaultLocalMicrophone();
        setLocalMicrophone(defaultMic);
      })();
    }
  }, []);

  const getDefaultLocalMicrophone = async () => {
    if (await getMicrophonePermission()) {
      const devices = await MediaDevicesService.enumerateAudioInputDevices();
      /*
       * in case of mobile we cannot determine default mic based on deviceId which is uuid.
       * We also need to check if deviceId exists  since some first calls to get devices
       * returns generic 'audioinput' without deviceId  as  index 0 device
       */
      if (devices.length && !isDesktop && devices[0].deviceId) {
        return devices[0];
      }
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        if (defaultMics.includes(device.deviceId)) {
          return device;
        }
      }
      return devices[0].deviceId ? devices[0] : null;
    }
    return null;
  };

  return {
    microphones: audioInputDevices,
    getMicrophones,
    selectMicrophone,
    getMicrophonePermission,
    localMicrophone,
    setLocalMicrophone,
    getDefaultLocalMicrophone,
    getSelectedMicrophone,
  };
};

export default useMicrophone;
