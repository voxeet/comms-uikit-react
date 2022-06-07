import MobileSDK from '@dolbyio/comms-sdk-react-native';

export default class SDKService {
  public static initialize(customerKey: string, customerSecret: string) {
    return MobileSDK.initialize(customerKey, customerSecret);
  }

  public static initializeToken(accessToken: string, refreshAccessToken: () => Promise<string>) {
    return MobileSDK.initializeToken(accessToken, refreshAccessToken);
  }
}
