import WebSDK from '@voxeet/voxeet-web-sdk';

export default class SDKService {
  public static initialize(customerKey: string, customerSecret: string) {
    return WebSDK.initialize(customerKey, customerSecret);
  }

  public static initializeToken(accessToken: string, refreshAccessToken: () => Promise<string>) {
    return WebSDK.initializeToken(accessToken, refreshAccessToken);
  }

  public static getSDKVersion() {
    return WebSDK.version;
  }
}
