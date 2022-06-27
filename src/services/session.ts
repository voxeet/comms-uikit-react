import WebSDK from '@voxeet/voxeet-web-sdk';
import type { ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';

export default class SessionService {
  public static open(participantInfo: ParticipantInfo) {
    return WebSDK.session.open(participantInfo);
  }

  public static close() {
    return WebSDK.session.close();
  }

  public static getParticipant() {
    return WebSDK.session.participant;
  }

  public static isOpen() {
    return WebSDK.session.isOpen();
  }
}
