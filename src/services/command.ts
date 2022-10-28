import WebSDK from '@voxeet/voxeet-web-sdk';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export default class CommandService {
  public static send(message: string) {
    return WebSDK.command.send(message);
  }

  public static onMessageReceived(handler: (participant: Participant, message: string) => void) {
    WebSDK.command.on('received', handler);
    return () => {
      WebSDK.command.removeListener('received', handler);
    };
  }
}
