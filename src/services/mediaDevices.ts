import WebSDK from '@voxeet/voxeet-web-sdk';

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
}
