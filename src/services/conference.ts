import WebSDK from '@voxeet/voxeet-web-sdk';
import type { ConferencePermission, ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export default class ConferenceService {
  public static create(options: ConferenceOptions) {
    return WebSDK.conference.create({
      params: {
        dolbyVoice: true,
        ...options.params,
      },
      ...options,
    });
  }

  public static current() {
    return WebSDK.conference.current;
  }

  public static participants() {
    return WebSDK.conference.participants;
  }

  public static fetch(conferenceId: string) {
    return WebSDK.conference.fetch(conferenceId);
  }

  public static join(conference: Conference, options: JoinOptions) {
    return WebSDK.conference.join(conference, options);
  }

  public static stopVideo(participant: Participant) {
    return WebSDK.conference.stopVideo(participant);
  }

  public static startVideo(participant: Participant) {
    return WebSDK.conference.startVideo(participant, false);
  }

  public static startAudio(participant: Participant) {
    return WebSDK.conference.startAudio(participant);
  }

  public static stopAudio(participant: Participant) {
    return WebSDK.conference.stopAudio(participant);
  }

  public static isSpeaking(participant: Participant, callback: (value: boolean) => void) {
    return WebSDK.conference.isSpeaking(participant, callback);
  }

  public static onParticipantsChange(handler: (data: Participant) => void) {
    WebSDK.conference.on('participantAdded', handler);
    WebSDK.conference.on('participantUpdated', handler);
    WebSDK.conference.on('', handler);
    return () => {
      WebSDK.conference.removeListener('participantAdded', handler);
      WebSDK.conference.removeListener('participantUpdated', handler);
    };
  }

  public static onStreamsChange(handler: (data: Participant) => void) {
    WebSDK.conference.on('streamAdded', handler);
    WebSDK.conference.on('streamRemoved', handler);
    WebSDK.conference.on('streamUpdated', handler);
    return () => {
      WebSDK.conference.removeListener('streamAdded', handler);
      WebSDK.conference.removeListener('streamRemoved', handler);
      WebSDK.conference.removeListener('streamUpdated', handler);
    };
  }

  public static onConferenceStatusChange(handler: (data: ConferenceStatus) => void) {
    WebSDK.conference.on('ended', handler);
    WebSDK.conference.on('joined', handler);
    WebSDK.conference.on('left', handler);
    return () => {
      WebSDK.conference.removeListener('ended', handler);
      WebSDK.conference.removeListener('joined', handler);
      WebSDK.conference.removeListener('left', handler);
    };
  }

  public static onPermissionsChange(handler: (data: ConferencePermission[]) => void) {
    WebSDK.conference.on('permissionsUpdated', handler);
    return () => {
      WebSDK.conference.removeListener('permissionsUpdated', handler);
    };
  }

  public static leave() {
    return WebSDK.conference.leave();
  }
}
