import WebSDK from '@voxeet/voxeet-web-sdk';
import type Recording from '@voxeet/voxeet-web-sdk/types/models/Recording';

export default class RecordingService {
  public static start() {
    return WebSDK.recording.start();
  }

  public static stop() {
    return WebSDK.recording.stop();
  }

  public static onStatusUpdated(handler: (isRecording: boolean, recording: Recording) => void) {
    WebSDK.recording.on('statusUpdated', handler);
    return () => {
      WebSDK.recording.removeListener('statusUpdated', handler);
    };
  }
}
