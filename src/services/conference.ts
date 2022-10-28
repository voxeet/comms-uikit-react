import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import type { ConferencePermission, ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

export default class ConferenceService {
  public static create(options: ConferenceOptions) {
    return VoxeetSDK.conference.create({
      params: {
        dolbyVoice: true,
        liveRecording: true,
        ...options.params,
      },
      ...options,
    });
  }

  public static setPackageUrlPrefix(prefix?: string) {
    if (prefix) {
      VoxeetSDK.packageUrlPrefix = prefix;
    }
  }

  public static current() {
    return VoxeetSDK.conference.current;
  }

  public static participants() {
    return VoxeetSDK.conference.participants;
  }

  public static fetch(conferenceId: string) {
    return VoxeetSDK.conference.fetch(conferenceId);
  }

  public static join(conference: Conference, options: JoinOptions) {
    return VoxeetSDK.conference.join(conference, options);
  }

  public static stopRemoteVideo(participant: Participant) {
    return VoxeetSDK.video.remote.stop(participant);
  }

  public static startRemoteVideo(participant: Participant) {
    return VoxeetSDK.video.remote.start(participant);
  }

  public static startRemoteAudio(participant: Participant) {
    return VoxeetSDK.audio.remote.start(participant);
  }

  public static stopRemoteAudio(participant: Participant) {
    return VoxeetSDK.audio.remote.stop(participant);
  }

  public static startLocalAudio() {
    return VoxeetSDK.audio.local.start();
  }

  public static stopLocalAudio() {
    return VoxeetSDK.audio.local.stop();
  }

  public static startLocalVideo(isBlurred?: boolean) {
    // @ts-expect-error problem with enum import from SDK
    return VoxeetSDK.video.local.start({}, isBlurred ? { type: 'bokeh' } : undefined);
  }

  public static stopLocalVideo() {
    return VoxeetSDK.video.local.stop();
  }

  public static isSpeaking(participant: Participant, callback: (value: boolean) => void) {
    return VoxeetSDK.conference.isSpeaking(participant, callback);
  }

  public static startScreenShare() {
    return VoxeetSDK.conference.startScreenShare();
  }

  public static stopScreenShare() {
    return VoxeetSDK.conference.stopScreenShare();
  }

  public static onParticipantsChange(handler: (data: Participant) => void) {
    VoxeetSDK.conference.on('participantAdded', handler);
    VoxeetSDK.conference.on('participantUpdated', handler);
    return () => {
      VoxeetSDK.conference.removeListener('participantAdded', handler);
      VoxeetSDK.conference.removeListener('participantUpdated', handler);
    };
  }

  public static onStreamsChange(handler: (data: Participant) => void) {
    VoxeetSDK.conference.on('streamAdded', handler);
    VoxeetSDK.conference.on('streamRemoved', handler);
    VoxeetSDK.conference.on('streamUpdated', handler);
    return () => {
      VoxeetSDK.conference.removeListener('streamAdded', handler);
      VoxeetSDK.conference.removeListener('streamRemoved', handler);
      VoxeetSDK.conference.removeListener('streamUpdated', handler);
    };
  }

  public static onScreenShareChange(
    onStartHandler: (participant: Participant, stream: MediaStreamWithType) => void,
    onStopHandler: (participant: Participant, stream: MediaStreamWithType) => void,
  ) {
    VoxeetSDK.conference.on('streamAdded', onStartHandler);
    VoxeetSDK.conference.on('streamRemoved', onStopHandler);
    return () => {
      VoxeetSDK.conference.on('streamAdded', onStartHandler);
      VoxeetSDK.conference.on('streamRemoved', onStopHandler);
    };
  }

  public static onConferenceStatusChange(handler: (data: ConferenceStatus) => void) {
    VoxeetSDK.conference.on('ended', handler);
    VoxeetSDK.conference.on('joined', handler);
    VoxeetSDK.conference.on('left', handler);
    return () => {
      VoxeetSDK.conference.removeListener('ended', handler);
      VoxeetSDK.conference.removeListener('joined', handler);
      VoxeetSDK.conference.removeListener('left', handler);
    };
  }

  public static onPermissionsChange(handler: (data: ConferencePermission[]) => void) {
    VoxeetSDK.conference.on('permissionsUpdated', handler);
    return () => {
      VoxeetSDK.conference.removeListener('permissionsUpdated', handler);
    };
  }

  public static onConferenceError(handler: (error: Error) => void) {
    VoxeetSDK.conference.on('error', handler);
    return () => {
      VoxeetSDK.conference.removeListener('error', handler);
    };
  }

  public static leave() {
    return VoxeetSDK.conference.leave();
  }

  public static playBlockedAudio() {
    return VoxeetSDK.conference.playBlockedAudio();
  }

  public static startBackgroundBlur() {
    // @ts-expect-error problem with enum import from SDK
    return VoxeetSDK.video.local.setProcessor({ type: 'bokeh' });
  }

  public static stopVideoProcessing() {
    return VoxeetSDK.video.local.disableProcessing();
  }
}
