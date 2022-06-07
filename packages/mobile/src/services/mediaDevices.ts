import MobileSDK from '@dolbyio/comms-sdk-react-native';

export default class MediaDevicesService {
  public static switchCamera() {
    return MobileSDK.mediaDevice.switchCamera();
  }

  public static switchSpeaker() {
    return MobileSDK.mediaDevice.switchSpeaker();
  }
}
