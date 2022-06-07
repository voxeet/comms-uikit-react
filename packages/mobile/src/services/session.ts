import MobileSDK from '@dolbyio/comms-sdk-react-native';
import type { ParticipantInfo } from '@dolbyio/comms-sdk-react-native/lib/typescript/services/conference/models';

export default class SessionService {
  public static async open(participantInfo: ParticipantInfo) {
    return MobileSDK.session.open(participantInfo);
  }

  public static async close() {
    try {
      await MobileSDK.session.close();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  public static async getUser() {
    return MobileSDK.session.getParticipant();
  }
}
