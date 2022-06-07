import WebSDK from '@voxeet/voxeet-web-sdk';

export default class MediaDevicesService {
  public static enumerateVideoDevices() {
    return WebSDK.mediaDevice.enumerateVideoDevices();
  }

  public static enumerateAudioInputDevices() {
    return WebSDK.mediaDevice.enumerateAudioDevices('input');
  }

  public static enumerateAudioOutputDevices() {
    return WebSDK.mediaDevice.enumerateAudioDevices('output');
  }

  public static selectCamera(device: string) {
    return WebSDK.mediaDevice.selectVideoInput(device, false);
  }

  public static selectMicrophone(device: string) {
    return WebSDK.mediaDevice.selectAudioInput(device);
  }

  public static selectSpeaker(device: string) {
    return WebSDK.mediaDevice.selectAudioOutput(device);
  }
}
