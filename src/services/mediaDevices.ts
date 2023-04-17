import WebSDK from '@voxeet/voxeet-web-sdk';

export type UpdatedList = {
  list: { videoInput: MediaDeviceInfo[]; audioInput: MediaDeviceInfo[]; audioOutput: MediaDeviceInfo[] };
  updates: {
    videoInput: { added: MediaDeviceInfo[]; removed: MediaDeviceInfo[] };
    audioInput: { added: MediaDeviceInfo[]; removed: MediaDeviceInfo[] };
    audioOutput: { added: MediaDeviceInfo[]; removed: MediaDeviceInfo[] };
  };
};

export default class MediaDevicesService {
  public static enumerateVideoInputDevices() {
    return WebSDK.mediaDevice.enumerateVideoInputDevices();
  }

  public static enumerateAudioInputDevices() {
    return WebSDK.mediaDevice.enumerateAudioInputDevices();
  }

  public static enumerateAudioOutputDevices() {
    return WebSDK.mediaDevice.enumerateAudioOutputDevices();
  }

  public static selectCamera(device: string) {
    return WebSDK.mediaDevice.selectVideoInput(device);
  }

  public static selectMicrophone(device: string) {
    return WebSDK.mediaDevice.selectAudioInput(device);
  }

  public static selectSpeaker(device: string) {
    return WebSDK.mediaDevice.selectAudioOutput(device);
  }

  public static getSelectedCamera() {
    return WebSDK.mediaDevice.selectedVideoInputDevice;
  }

  public static getSelectedMicrophone() {
    return WebSDK.mediaDevice.selectedAudioInputDevice;
  }

  public static getSelectedSpeaker() {
    return WebSDK.mediaDevice.selectedAudioOutputDevice;
  }

  public static onDeviceListChanged(handler: (updatedList: UpdatedList) => void) {
    WebSDK.mediaDevice.on('deviceChanged', handler);
    return () => {
      WebSDK.mediaDevice.removeListener('deviceChanged', handler);
    };
  }
}
