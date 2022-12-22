/* eslint-disable no-alert */
import type { AudioCaptureModeOptions } from '@voxeet/voxeet-web-sdk/types/models/Audio';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type { ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { JoinOptions, ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import type Recording from '@voxeet/voxeet-web-sdk/types/models/Recording';
import type { VideoForwardingOptions } from '@voxeet/voxeet-web-sdk/types/models/VideoForwarding';
import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { BlockedAudioState } from '../hooks/types/Audio';
import type { LocalVideoParams } from '../hooks/types/Camera';
import { VideoForwardingStrategy } from '../hooks/types/Conferencing';
import type { LiveStreamProvider } from '../hooks/types/LiveStreaming';
import { LiveStreamingMessages } from '../hooks/types/LiveStreaming';
import { LogLevel } from '../hooks/types/Logger';
import { Status } from '../hooks/types/misc';
import type { Notification, NotificationBase } from '../hooks/types/Notifications';
import type { ParticipantStatus } from '../hooks/types/Participants';
import { AudioCaptureMode, AudioProcessingMessages } from '../hooks/types/UseAudioProcessing';
import useLogger from '../hooks/useLogger';
import commandService from '../services/command';
import conferenceService from '../services/conference';
import MediaDevicesService from '../services/mediaDevices';
import recordingService from '../services/recording';
import sdkService from '../services/sdk';
import sessionService from '../services/session';
import { throwErrorMessage } from '../utils/throwError.util';

type DolbyIoWindow = {
  dolbyio: {
    isInitialized: boolean;
  };
};

const dioWindow = window as Window & typeof globalThis & DolbyIoWindow;
dioWindow.dolbyio = {
  isInitialized: false,
};

type ScreenSharingDataType = {
  owner: Participant | null;
  stream: MediaStreamWithType | null;
  status: Status;
  isPendingTakeoverRequest: boolean;
  isPresentationModeActive: boolean;
};

type RecordingDataType = {
  ownerId: string | null;
  timestamp: number | null;
  status: Status;
  isRecordingModeActive: boolean;
};

type LiveStreamingDataType = {
  owner: Participant | null;
  timestamp: number | null;
  status: Status;
  isLiveStreamingModeActive: boolean;
  provider: LiveStreamProvider;
  rtmp?: string;
};

type MessageData = {
  sender: Participant | null;
  message: Record<string, unknown> | null;
};

const initialScreenSharingData: ScreenSharingDataType = {
  owner: null,
  stream: null,
  status: Status.Other,
  isPendingTakeoverRequest: false,
  isPresentationModeActive: false,
};

const initialRecordingData: RecordingDataType = {
  ownerId: null,
  timestamp: null,
  status: Status.Other,
  isRecordingModeActive: false,
};

const initialLiveStreamingData: LiveStreamingDataType = {
  owner: null,
  timestamp: null,
  status: Status.Other,
  isLiveStreamingModeActive: false,
  provider: null,
};

export type CommsContextType = {
  openSession: (participantInfo: ParticipantInfo) => Promise<void>;
  closeSession: () => Promise<void>;
  createConference: (options: ConferenceOptions) => Promise<Conference>;
  fetchConference: (id: string) => Promise<Conference>;
  joinConference: (conference: Conference, options: JoinOptions) => Promise<Conference>;
  leaveConference: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  isAudio: boolean;
  toggleVideo: () => Promise<void>;
  playBlockedAudio: () => Promise<void>;
  isVideo: boolean;
  startParticipantAudio: (participant: Participant) => Promise<void>;
  stopParticipantAudio: (participant: Participant) => Promise<void>;
  startRemoteParticipantVideo: (participant: Participant) => Promise<void>;
  stopRemoteParticipantVideo: (participant: Participant) => Promise<void>;
  participant: Participant | null;
  conference: Conference | null;
  conferenceStatus: ConferenceStatus | null;
  participants: Participant[];
  participantsStatus: {
    [key: string]: ParticipantStatus;
  };
  prevConference: {
    participant: string;
    name: string;
  } | null;
  addIsSpeakingListener: (participant: Participant) => () => void;
  resetVideo: () => void;
  resetAudio: () => void;
  localCamera: Partial<MediaDeviceInfo> | null;
  setLocalCamera: React.Dispatch<React.SetStateAction<Partial<MediaDeviceInfo> | null>>;
  localMicrophone: Partial<MediaDeviceInfo> | null;
  setLocalMicrophone: React.Dispatch<React.SetStateAction<Partial<MediaDeviceInfo> | null>>;
  localSpeakers: Partial<MediaDeviceInfo> | null;
  setLocalSpeakers: React.Dispatch<React.SetStateAction<Partial<MediaDeviceInfo> | null>>;
  blockedAudioState: BlockedAudioState;
  setBlockedAudioState: React.Dispatch<React.SetStateAction<BlockedAudioState>>;
  isPageMuted: boolean;
  toggleMuteParticipants: () => void;
  startScreenShare: () => Promise<boolean>;
  stopScreenShare: () => Promise<void>;
  screenSharingData: ScreenSharingDataType;
  recordingData: RecordingDataType;
  setSharingErrors: (error?: ErrorCodes) => void;
  setRecordingErrors: (error?: ErrorCodes) => void;
  setLiveStreamingErrors: (error?: ErrorCodes) => void;
  showNotification: (notification: NotificationBase) => void;
  notifications: Notification[];
  removeNotification: (notificationId: number) => void;
  sendMessage: (message: Record<string, unknown>) => Promise<void>;
  messageData: MessageData;
  clearMessage: () => void;
  setPendingTakeoverRequest: (pendingTakeoverRequest: boolean) => void;
  resetScreenSharingData: () => void;
  resetRecordingData: () => void;
  errors: Errors;
  removeError: (params: { error?: ErrorCodes; level?: keyof Errors }) => void;
  stopRecording: () => Promise<boolean>;
  startRecording: () => Promise<boolean>;
  removeSdkErrors: (error?: ErrorCodes) => void;
  hasCameraPermission: boolean;
  hasMicrophonePermission: boolean;
  setHasCameraPermission: React.Dispatch<React.SetStateAction<boolean>>;
  setHasMicrophonePermission: React.Dispatch<React.SetStateAction<boolean>>;
  startBackgroundBlur: () => void;
  stopVideoProcessing: () => void;
  isBlurred: boolean;
  setIsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
  liveStreamingData: LiveStreamingDataType;
  setLiveStreamingData: React.Dispatch<React.SetStateAction<LiveStreamingDataType>>;
  startLiveStreaming: (start: () => Promise<void>, rtmp: string, provider: LiveStreamProvider) => Promise<boolean>;
  stopLiveStreaming: (stop: () => Promise<void>) => Promise<boolean>;
  resetLiveStreamingData: () => void;
  getAudioCaptureMode: () => Promise<AudioCaptureModeOptions | undefined>;
  setAudioCaptureMode: (option: Partial<AudioCaptureModeOptions>) => Promise<void>;
  audioMode?: AudioCaptureModeOptions;
  startLocalVideo: (params: LocalVideoParams) => Promise<MediaStreamTrack>;
  stopLocalVideo: () => Promise<void>;
  localStream: MediaStream | null;
  setLocalStream: (stream?: MediaStream) => void;
  isSessionOpened: () => boolean;
  setVideoForwarding: (maxVideoForwarding: number, option?: Partial<VideoForwardingOptions>) => Promise<void>;
  maxVideoForwarding: number;
};

export type CommsProviderProps = {
  children: ReactNode;

  /**
   * Client access token to use to initialize the SDK.
   */
  token: string;

  /**
   * Function to use to refresh the client access token.
   */
  refreshToken?: () => Promise<string>;
  /**
   * Prop to overwrite CommsProvider value.
   */
  value?: Partial<CommsContextType>;
  /**
   * Prop to set VoxeetSDK packageUrlPrefix value.
   */
  packageUrlPrefix?: string;
};

export const CommsContext = createContext<CommsContextType>({} as CommsContextType);

// We should add some SDK error codes here
type ErrorsPartial = Partial<Record<ErrorCodes, boolean>>;
export type Errors = {
  recordingErrors: ErrorsPartial;
  liveStreamingErrors: ErrorsPartial;
  screenShareErrors: ErrorsPartial;
  audioCapture: ErrorsPartial;
  sdkErrors: ErrorsPartial;
  mediaDevicesErrors: ErrorsPartial;
};

export enum ErrorCodes {
  'PermissionDeniedBySystem' = 'Permission denied by system',
  'PermissionDeniedBySystemMozilla' = 'The object can not be found here.',
  'LackOfBrowserPermissionsChrome' = 'Permission denied',
  'LackOfBrowserPermissionsMozilla' = 'The request is not allowed by the user agent or the platform in the current context.',
  'LackOfBrowserPermissionsSafari' = 'The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.',
  'LackOfBrowserPermissions' = 'Lack of browser permissions',
  'ScreenShareAutoTakeoverErrorSafari' = 'getDisplayMedia must be called from a user gesture handler.',
  'ScreenShareAutoTakeoverErrorMozilla' = 'getDisplayMedia requires transient activation from a user gesture.',
  'ScreenShareAutoTakeoverError' = 'Screen share auto takeover error',
  'ScreenShareAlreadyInProgress' = 'ScreenShare already in progress',
  'IncorrectSession' = 'Incorrect participant session',
  'CouldNotStartVideoSource' = 'Could not start video source',
  'PeerConnectionDisconnectedError' = 'PeerConnectionDisconnectedError',
  'AudioCaptureParameterError' = 'Unable to change audio capture mode. Please provide a valid audio capture mode.',
  'ConferenceIsNotInitialized' = 'Conference is not initialized.',
  'CorruptedVideoTrack' = 'CorruptedVideoTrack',
  'ExpiredOrInvalidToken' = 'Expired or invalid token',
}

/*
 * For storing users previously muted , in case of page mute trigger.
 */

const singleParticipantMutedSet = new Set();
const liveStreamAwareParticipants = new Set();
let retries = 0;

export const errorMapper = (error: unknown) => {
  const { message } = (error as Error) || { message: '' };
  switch (message) {
    case ErrorCodes.PermissionDeniedBySystem:
    case ErrorCodes.PermissionDeniedBySystemMozilla:
      return ErrorCodes.PermissionDeniedBySystem;
    case ErrorCodes.ScreenShareAlreadyInProgress:
      return ErrorCodes.ScreenShareAlreadyInProgress;
    case ErrorCodes.LackOfBrowserPermissionsChrome:
    case ErrorCodes.LackOfBrowserPermissionsMozilla:
    case ErrorCodes.LackOfBrowserPermissionsSafari:
      return ErrorCodes.LackOfBrowserPermissions;
    case ErrorCodes.ScreenShareAutoTakeoverErrorSafari:
    case ErrorCodes.ScreenShareAutoTakeoverErrorMozilla:
      return ErrorCodes.ScreenShareAutoTakeoverError;
    case ErrorCodes.AudioCaptureParameterError:
      return ErrorCodes.AudioCaptureParameterError;
    default:
      return undefined;
  }
};

const initialErrors = {
  recordingErrors: {},
  liveStreamingErrors: {},
  screenShareErrors: {},
  audioCapture: {},
  sdkErrors: {},
  mediaDevicesErrors: {},
};

const CommsProvider = ({ children, token, refreshToken, value, packageUrlPrefix }: CommsProviderProps) => {
  const [participant, setParticipant] = useState<CommsContextType['participant']>(null);
  const [conference, setConference] = useState<CommsContextType['conference']>(null);
  const [conferenceStatus, setConferenceStatus] = useState<CommsContextType['conferenceStatus']>(null);

  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [participantsStatus, setParticipantsStatus] = useState<CommsContextType['participantsStatus']>({});

  const [prevConference, setPrevConference] = useState<CommsContextType['prevConference']>(null);

  const [isAudio, setIsAudio] = useState<boolean>(true);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [maxVideoForwarding, setMaxVideoForwarding] = useState<number>(24);

  const [localCamera, setLocalCamera] = useState<CommsContextType['localCamera']>(null);
  const [localMicrophone, setLocalMicrophone] = useState<CommsContextType['localMicrophone']>(null);
  const [localSpeakers, setLocalSpeakers] = useState<CommsContextType['localSpeakers']>(null);

  const [blockedAudioState, setBlockedAudioState] = useState<BlockedAudioState>(BlockedAudioState.INACTIVATED);
  const [isPageMuted, setIsPageMuted] = useState(false);
  const [screenSharingData, setScreenSharingData] = useState<ScreenSharingDataType>(initialScreenSharingData);
  const [recordingData, setRecordingData] = useState<RecordingDataType>(initialRecordingData);
  const [liveStreamingData, setLiveStreamingData] = useState<LiveStreamingDataType>(initialLiveStreamingData);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // We should expand this with specific context errors
  const [errors, setErrors] = useState<Errors>(initialErrors);
  const [messageData, setMessageData] = useState<MessageData>({ sender: null, message: null });
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [audioMode, setAudioMode] = useState<AudioCaptureModeOptions | undefined>();
  const { log } = useLogger();
  const [localStream, dispatchSetLocalStream] = useState<MediaStream | null>(null);
  const [participantsWithMusic, setParticipantsWithMusic] = useState<string[]>([]);

  useEffect(() => {
    if (conference) {
      const userStreamFromConference = participant?.streams[0];
      setLocalStream(userStreamFromConference);
    }
  }, [conference]);

  const setLocalStream = (stream?: MediaStream) => {
    dispatchSetLocalStream(stream || null);
  };
  // INITIALIZATION
  useEffect(() => {
    if (!dioWindow.dolbyio.isInitialized) {
      if (token) {
        // eslint-disable-next-line no-promise-executor-return
        const refreshFallback = () => new Promise<string>((resolve) => resolve(token));
        sdkService.initializeToken(token, refreshToken || refreshFallback);
        dioWindow.dolbyio.isInitialized = true;
      } else {
        throw new Error('Initialization parameters missing.');
      }
    }
  }, [token, refreshToken]);

  // SET VOXEET PREFIX
  useEffect(() => {
    conferenceService.setPackageUrlPrefix(packageUrlPrefix);
  }, [packageUrlPrefix]);

  const participantsArray = useMemo(() => {
    return Array.from(participants.values());
  }, [participants]);

  useEffect(() => {
    const map: CommsContextType['participantsStatus'] = {};
    setParticipantsStatus((prev) => {
      participantsArray.forEach((p) => {
        const isVideoFromStreamEnabled = p.streams[p.streams.length - 1]?.getVideoTracks().length > 0;
        const isLocal = p.id === participant?.id;
        const remoteLocalAudioStatus = () => {
          let status = true;
          if (prev[p.id]?.isLocalAudio !== undefined) {
            status = prev[p.id]?.isLocalAudio;
          }
          return status;
        };

        map[p.id] = {
          isSpeaking: !!participantsStatus[p.id]?.isSpeaking,
          isLocal,
          isRemoteAudio: p.audioTransmitting,
          isLocalAudio: isLocal ? isAudio : remoteLocalAudioStatus(),
          isVideo: isLocal ? isVideoFromStreamEnabled && isVideo : isVideoFromStreamEnabled,
          isRemoteMusicMode: prev[p.id]?.isRemoteMusicMode,
        };
      });
      return map;
    });
  }, [participantsArray, participant, isVideo]);

  // MUSIC MODE MESSAGING

  useEffect(() => {
    Object.keys(participantsStatus).forEach((id) => {
      if (participantsStatus[id].isRemoteMusicMode) {
        setParticipantsWithMusic((prev) => [...prev, id]);
      } else {
        const indexOfId = participantsWithMusic.indexOf(id);
        setParticipantsWithMusic((prev) => {
          return prev.splice(indexOfId, 1);
        });
      }
    });
    if (participant) {
      if (audioMode?.mode === AudioCaptureMode.Music) {
        setParticipantsWithMusic((prev) => [...prev, participant.id]);
      } else {
        const indexOfId = participantsWithMusic.indexOf(participant.id);
        setParticipantsWithMusic((prev) => {
          return prev.splice(indexOfId, 1);
        });
      }
    }
  }, [participantsStatus, audioMode]);

  useEffect(() => {
    const participantsWithMusicMessage = {
      text: AudioProcessingMessages.PARTICIPANTS_STATUS,
      data: participantsWithMusic,
    };

    const sendStatusMessage = async () => {
      await sendMessage(participantsWithMusicMessage);
    };

    if (conference && participants && audioMode?.mode === AudioCaptureMode.Music) {
      sendStatusMessage();
    }
  }, [participants.size]);

  useEffect(() => {
    if (
      messageData.message?.text === AudioProcessingMessages.PARTICIPANTS_STATUS &&
      Array.isArray(messageData.message.data)
    ) {
      messageData.message.data.forEach((id) => {
        setParticipantsStatus((participantsStatus) => {
          return {
            ...participantsStatus,
            [id]: {
              ...participantsStatus[id],
              isRemoteMusicMode: true,
            },
          };
        });
      });
    }
  }, [messageData]);

  useEffect(() => {
    if (participant && participant.info.name && conference) {
      setPrevConference({
        participant: participant.info.name,
        name: conference.alias,
      });
    }
  }, [participant, conference]);

  const openSession = async (participantInfo: ParticipantInfo): Promise<void> => {
    if (sessionService.isOpen()) {
      log(LogLevel.warn, 'There is an already an open session!');
      return;
    }

    const timeoutPromise = setTimeout(async () => {
      await sessionService.close();
    }, 5000);
    try {
      await sessionService.open(participantInfo);
      clearTimeout(timeoutPromise);
      setParticipant(sessionService.getParticipant());
    } catch {
      log(LogLevel.info, 'Session setup timed out');
      clearTimeout(timeoutPromise);
      setParticipant(null);
    }
  };

  const closeSession = async (): Promise<void> => {
    log(LogLevel.info, 'Closing session');
    await sessionService.close();
    setParticipant(null);
  };

  const startParticipantAudio = async (participantArg: Participant, isBatch?: boolean): Promise<void> => {
    const p = conferenceService.participants().get(participantArg.id);
    if (p) {
      log(LogLevel.info, 'Starting audio for participant.', p);
      if (participant?.id === participantArg.id) {
        await conferenceService.startLocalAudio();
      } else {
        await conferenceService.startRemoteAudio(p);
      }
      if (!isBatch) singleParticipantMutedSet.delete(participantArg.id);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participantArg.id]: {
            ...participantsStatus[participantArg.id],
            isLocalAudio: true,
          },
        };
      });
    }
  };

  const stopParticipantAudio = async (participantArg: Participant, isBatch?: boolean): Promise<void> => {
    const p = conferenceService.participants().get(participantArg.id);
    if (p) {
      log(LogLevel.info, 'Stopping audio for participant', p);
      if (participantArg.id === participant?.id) {
        await conferenceService.stopLocalAudio();
      } else {
        await conferenceService.stopRemoteAudio(p);
      }
      if (!isBatch) singleParticipantMutedSet.add(participantArg.id);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participantArg.id]: {
            ...participantsStatus[participantArg.id],
            isLocalAudio: false,
          },
        };
      });
    }
  };

  const toggleMuteParticipants = async () => {
    const onlyRemoteNotMutedParticipants = participantsArray.filter(
      (p: Participant) => p.id !== participant?.id && !singleParticipantMutedSet.has(p.id),
    );
    try {
      await Promise.all(
        onlyRemoteNotMutedParticipants.map(async (participant) => {
          if (!isPageMuted) {
            return stopParticipantAudio(participant, true);
          }
          return startParticipantAudio(participant, true);
        }),
      );
      setIsPageMuted((prevState) => !prevState);
    } catch (e) {
      log(LogLevel.error, 'Error while toggling mute status', e);
      throwErrorMessage(e);
    }
  };

  const toggleAudio = async (): Promise<void> => {
    if (conference && participant) {
      const localUser = conferenceService.participants().get(participant.id);
      if (localUser) {
        if (localUser.audioTransmitting) {
          log(LogLevel.info, 'Muting local user');
          await stopParticipantAudio(localUser);
          setIsAudio(false);
        } else {
          log(LogLevel.info, 'Unmuting local user');
          await startParticipantAudio(localUser);
          setIsAudio(true);
        }
      }
    } else if (isAudio) {
      // Currently SDK implementation is not exposing audio functionalities before conference
      // await conferenceService.stopLocalAudio();
      setIsAudio(false);
    } else {
      // await conferenceService.startLocalAudio();
      setIsAudio(true);
    }
  };

  const startRemoteParticipantVideo = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.startRemoteVideo(p);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participant.id]: {
            ...participantsStatus[participant.id],
            isVideo: participant.streams[0].active,
          },
        };
      });
    }
  };

  const stopRemoteParticipantVideo = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.stopRemoteVideo(p);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participant.id]: {
            ...participantsStatus[participant.id],
            isVideo: participant.streams[0].active,
          },
        };
      });
    }
  };

  const toggleVideo = async (): Promise<void> => {
    /*
     * Resetting retries counter while toggling video is necessary , to allow desired retry
     */
    retries = 0;
    if (conference && participant) {
      const localUser = conferenceService.participants().get(participant.id);
      if (localUser) {
        /*
         * We need to omit ScreenShare screen in order to fall into else statement. While screen sharing is active
         * this ScreenShare stream is attached to participant
         */
        const onlyCameraStreams = localUser.streams.filter((stream) => stream.type !== 'ScreenShare');
        const currentStream = onlyCameraStreams[onlyCameraStreams.length - 1];
        if (currentStream?.getVideoTracks().length > 0) {
          await conferenceService.stopLocalVideo();
          log(LogLevel.info, "Turning off local user's video");
          setIsVideo(false);
        } else {
          await conferenceService.startLocalVideo({ isBlurred });
          log(LogLevel.info, "Turning on local user's video");
          setIsVideo(true);
        }
      }
    } else if (isVideo) {
      await conferenceService.stopLocalVideo();
      setIsVideo(false);
    } else {
      const track = await conferenceService.startLocalVideo({ isBlurred });
      const stream = new MediaStream([track]);
      setIsVideo(true);
      setLocalStream(stream);
    }
  };

  useEffect(() => {
    if (isVideo && participant && !conference) {
      (async () => {
        if (localStream && localCamera && /android/i.test(navigator.userAgent || navigator.vendor)) {
          return MediaDevicesService.selectCamera(localCamera?.deviceId || '');
        }
        const track = await conferenceService.startLocalVideo({
          deviceId: localCamera ? localCamera.deviceId : undefined,
          isBlurred,
        });
        const stream = new MediaStream([track]);
        return setLocalStream(stream);
      })();
    }
  }, [localCamera]);

  const playBlockedAudio = async (): Promise<void> => {
    await conferenceService.playBlockedAudio();
  };

  // CONFERENCE METHODS

  const createConference = useCallback((conferenceOptions: ConferenceOptions): Promise<Conference> => {
    return conferenceService.create(conferenceOptions);
  }, []);

  const fetchConference = useCallback((id: string): Promise<Conference> => {
    return conferenceService.fetch(id);
  }, []);

  const joinConference = useCallback(async (conference: Conference, joinOptions: JoinOptions): Promise<Conference> => {
    const joinedConference = await conferenceService.join(conference, joinOptions);
    setConference(joinedConference);
    return joinedConference;
  }, []);

  const leaveConference = useCallback(async (): Promise<void> => {
    await conferenceService.leave();
    setRecordingData(initialRecordingData);
    setConference(null);
    setMaxVideoForwarding(24);
    setParticipantsStatus({});
    setConferenceStatus(null);
    setParticipants(new Map());
    setLocalStream(undefined);
    // TODO remove when video blur preview will be available in setup
    setIsBlurred(false);
  }, []);

  const resetVideo = () => {
    setIsVideo(true);
  };

  const resetAudio = () => {
    setIsAudio(true);
    setIsPageMuted(false);
    singleParticipantMutedSet.clear();
  };

  const startScreenShare = async () => {
    setScreenSharingData((prev) => ({
      ...prev,
      status: Status.Loading,
    }));
    setSharingErrors();

    try {
      await conferenceService.startScreenShare();
      setScreenSharingData((prev) => ({
        ...prev,
        owner: participant,
        isPresentationModeActive: true,
      }));
      return true;
    } catch (error) {
      const message = errorMapper(error);
      if (message) {
        setSharingErrors(message);
      }
      if (message === ErrorCodes.LackOfBrowserPermissions || message === ErrorCodes.ScreenShareAutoTakeoverError) {
        setScreenSharingData((prev) => ({
          ...prev,
          owner: null,
          status: Status.Other,
          isPresentationModeActive: false,
        }));
      } else if (message !== ErrorCodes.ScreenShareAlreadyInProgress) {
        setScreenSharingData((prev) => ({
          ...prev,
          owner: participant,
          status: Status.Error,
          isPresentationModeActive: true,
        }));
      }
      return false;
    }
  };

  const stopScreenShare = async () => {
    try {
      await conferenceService.stopScreenShare();
      setScreenSharingData((prev) => ({
        ...prev,
        owner: null,
        status: Status.Other,
        isPresentationModeActive: false,
      }));
    } catch (error) {
      if (error instanceof Error) {
        alert('Stop screen share error!');
      }
    }
  };

  const startRecording = async () => {
    setRecordingData((prev) => ({
      ...prev,
      status: Status.Loading,
    }));
    setRecordingErrors();
    try {
      await recordingService.start();

      if (participant) {
        setRecordingData((prev) => ({
          ...prev,
          ownerId: participant.id,
          isRecordingModeActive: true,
        }));
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        log(LogLevel.error, error.message);
      }
      const message = errorMapper(error);
      if (message) {
        setRecordingErrors(errorMapper(message));
      }

      if (participant) {
        setRecordingData((prev) => ({
          ...prev,
          ownerId: participant.id,
          status: Status.Error,
          isRecordingModeActive: true,
        }));
      }
      return false;
    }
  };

  const stopRecording = async () => {
    try {
      await recordingService.stop();
      setRecordingData((prev) => ({
        ...prev,
        ownerId: null,
        timestamp: null,
        status: Status.Other,
        isRecordingModeActive: false,
      }));
      return true;
    } catch (error) {
      log(LogLevel.error, JSON.stringify(error));
      return false;
    }
  };

  // extend start with error types
  const startLiveStreaming: CommsContextType['startLiveStreaming'] = async (start, rtmp, provider) => {
    setLiveStreamingData((prev) => ({
      ...prev,
      status: Status.Loading,
    }));
    setLiveStreamingErrors();

    try {
      await start();
      const timestamp = Date.now();
      if (participant) {
        setLiveStreamingData((prev) => ({
          ...prev,
          owner: participant,
          isLiveStreamingModeActive: true,
          status: Status.Active,
          timestamp,
          provider,
          rtmp,
        }));
        const startMessage = {
          text: LiveStreamingMessages.STARTED,
          timestamp,
          owner: participant,
          provider,
        };

        await sendMessage(startMessage);
      }
      return true;
    } catch (error: any) {
      if (error instanceof Error) {
        log(LogLevel.error, error.message);
      }
      const { message } = error.data;
      if (message) {
        setLiveStreamingErrors(message);
      }

      setLiveStreamingData((prev) => ({
        ...prev,
        owner: participant,
        status: Status.Error,
        isLiveStreamingModeActive: true,
      }));
      return false;
    }
  };

  const stopLiveStreaming: CommsContextType['stopLiveStreaming'] = async (stop) => {
    setLiveStreamingErrors();
    try {
      await stop();
      if (participant) {
        setLiveStreamingData((prev) => ({
          ...prev,
          rtmp: undefined,
          timestamp: null,
          provider: null,
          owner: null,
          isLiveStreamingModeActive: false,
          status: Status.Other,
        }));
      }
      const stopMessage = {
        text: LiveStreamingMessages.STOPPED,
      };

      await sendMessage(stopMessage);
      liveStreamAwareParticipants.clear();
      return true;
    } catch (error: any) {
      if (error instanceof Error) {
        log(LogLevel.error, error.message);
      }
      const { message: errorMessage } = error.data;
      const message = errorMapper(errorMessage);
      if (message) {
        setLiveStreamingErrors(errorMapper(message));
      }

      return false;
    }
  };

  useEffect(() => {
    if (messageData.message) {
      const { text, timestamp, owner, provider, id } = messageData.message;
      if ((id && id === participant?.id) || !id) {
        if (text === LiveStreamingMessages.STARTED && timestamp && owner) {
          setLiveStreamingData(
            (prev) =>
              ({
                ...prev,
                owner,
                timestamp,
                provider,
                status: Status.Active,
              } as LiveStreamingDataType),
          );
        } else if (text === LiveStreamingMessages.STOPPED) {
          setLiveStreamingData((prev) => ({
            ...prev,
            owner: null,
            timestamp: null,
            provider: null,
            status: Status.Other,
          }));
        }
      }
    }
  }, [messageData]);

  const resetScreenSharingData = () => {
    setScreenSharingData(initialScreenSharingData);
  };

  const resetRecordingData = () => {
    setRecordingData(initialRecordingData);
  };

  const resetLiveStreamingData = () => {
    setLiveStreamingData(initialLiveStreamingData);
  };

  const sendMessage = async (message: Record<string, unknown>) => {
    try {
      await commandService.send(JSON.stringify(message));
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Cannot send message');
      }
    }
  };

  const addIsSpeakingListener = (participant: Participant) => {
    const interval = setInterval(() => {
      if (conferenceService.current()?.id) {
        conferenceService.isSpeaking(participant, (speakingState: boolean) => {
          setParticipantsStatus((participantsStatus) => {
            const status = participantsStatus[participant.id];
            if (status && status?.isSpeaking !== speakingState) {
              return {
                ...participantsStatus,
                [participant.id]: {
                  ...status,
                  isSpeaking: speakingState,
                },
              };
            }
            return participantsStatus;
          });
        });
      }
    }, 500);
    return () => {
      clearInterval(interval);
    };
  };

  // ADDING EVENT HANDLERS

  const onConferenceStatusChange = (status: ConferenceStatus) => {
    setConferenceStatus(status);
  };

  const onParticipantsChange = async (updatedParticipant: Participant) => {
    if (['Left', 'Kicked'].includes(updatedParticipant.status)) {
      liveStreamAwareParticipants.delete(updatedParticipant.id);
      if (updatedParticipant.id === liveStreamingData.owner?.id && liveStreamingData.status === Status.Active) {
        resetLiveStreamingData();
      }
      /*
       * Since we are getting error from SDK about emitting stopStream event, right now we need to explicitly clear data about screenSharing
       * This occurs while screenSharing on Safari and mainly while rejoining and screenSharing
       */
      if (updatedParticipant.id === screenSharingData.owner?.id) {
        setScreenSharingData(initialScreenSharingData);
      }
      return setParticipants((participants) => {
        participants.delete(updatedParticipant.id);
        return new Map(participants);
      });
    }

    if (
      liveStreamingData.status === Status.Active &&
      liveStreamingData.isLiveStreamingModeActive &&
      !liveStreamAwareParticipants.has(updatedParticipant.id)
    ) {
      const { timestamp, provider } = liveStreamingData;
      const startMessage = {
        text: LiveStreamingMessages.STARTED,
        timestamp,
        owner: participant,
        provider,
        id: updatedParticipant.id,
      };

      await sendMessage(startMessage);
      liveStreamAwareParticipants.add(updatedParticipant.id);
    }
    const p = participants.get(updatedParticipant.id);
    setParticipants((participants) => {
      return new Map(
        participants.set(updatedParticipant.id, {
          ...p,
          ...updatedParticipant,
          audioReceivingFrom: updatedParticipant.audioReceivingFrom,
        } as Participant),
      );
    });
    if (isPageMuted && updatedParticipant.id !== participant?.id) {
      await stopParticipantAudio(updatedParticipant, true);
    }

    if (updatedParticipant.id !== participant?.id) {
      if (
        singleParticipantMutedSet.has(updatedParticipant.id) &&
        (participantsStatus[updatedParticipant.id]?.isLocalAudio || !participantsStatus[updatedParticipant.id])
      ) {
        return stopParticipantAudio(updatedParticipant);
      }
    }
    return true;
  };

  const onStreamsChange = (updatedParticipant: Participant) => {
    if (updatedParticipant.id === participant?.id) {
      /*
       * Updating local stream to force re-rendering of videoLocal while swap camera
       */
      if (updatedParticipant.streams.length && updatedParticipant.streams[0].getVideoTracks().length) {
        const { streams } = participant;
        const tracks = streams[0]?.getVideoTracks?.();
        const videoTrack = tracks[0];
        setLocalStream(videoTrack && new MediaStream([videoTrack]));
      }
    }
    setParticipants((participants) => {
      const p = participants.get(updatedParticipant.id);
      if (p) {
        return new Map(
          participants.set(updatedParticipant.id, {
            ...p,
            ...updatedParticipant,
            audioReceivingFrom: updatedParticipant.audioReceivingFrom,
          } as Participant),
        );
      }
      return participants;
    });
  };

  const onVideoUpdated = async (track: MediaStreamTrack) => {
    setLocalStream(new MediaStream([track]));
    if (track.readyState === 'ended') {
      setErrors((prev) => ({
        ...prev,
        mediaDevicesErrors: { ...prev.mediaDevicesErrors, [ErrorCodes.CorruptedVideoTrack]: true },
      }));
      log(LogLevel.warn, 'We received a faulty video track');
    }
    if (track.label === localCamera?.label) {
      return null;
    }
    const camera = (await MediaDevicesService.enumerateVideoInputDevices()).find(
      (d) => track.label === d.label,
    ) as MediaDeviceInfo;

    return setLocalCamera(camera);
    /*
     * For just updating track - use
     // * return setLocalStream(new MediaStream([track]));
     */
  };

  const onScreenShareStart = (participant: Participant, stream: MediaStreamWithType) => {
    if (stream.type === 'ScreenShare') {
      try {
        setSharingErrors();
        setScreenSharingData((prev) => ({
          ...prev,
          owner: participant,
          stream,
          status: Status.Active,
        }));
        log(LogLevel.info, `Owner ${participant.info.name} finished their screen share stream.`);
      } catch (error) {
        const message = errorMapper(error);
        if (message) setSharingErrors(errorMapper(message));
        setScreenSharingData((prev) => ({
          ...prev,
          owner: participant,
          stream,
          status: Status.Error,
        }));
      }
    }
  };

  const onScreenShareStop = (participant: Participant, stream: MediaStreamWithType) => {
    if (stream.type === 'ScreenShare') {
      try {
        setSharingErrors();
        setScreenSharingData((prev) => ({
          ...prev,
          owner: null,
          stream: null,
          status: Status.Other,
        }));
      } catch (error) {
        const message = errorMapper(error);
        if (message) setSharingErrors(errorMapper(message));
        setScreenSharingData((prev) => ({
          ...prev,
          owner: participant,
          stream,
        }));
      }
    }
  };

  const onRecordingStatusUpdated = (isRecording: boolean, recording: Recording) => {
    try {
      setRecordingErrors();
      setRecordingData((prev) => ({
        ...prev,
        ownerId: recording ? recording.participantId : null,
        timestamp: recording ? recording.startTimestamp : null,
        status: isRecording ? Status.Active : Status.Other,
      }));
    } catch (error) {
      if (error instanceof Error) {
        log(LogLevel.error, error.message);
      }
      const message = errorMapper(error);
      if (message) setRecordingErrors(errorMapper(message));
    }
  };

  const setPendingTakeoverRequest = (isPendingTakeoverRequest: boolean) => {
    setScreenSharingData((prev) => ({
      ...prev,
      isPendingTakeoverRequest,
    }));
  };

  const setSharingErrors = (errorCode?: ErrorCodes) => {
    setErrors((prev) => ({
      ...prev,
      screenShareErrors: errorCode ? { ...prev.screenShareErrors, [errorCode]: true } : {},
    }));
  };

  const setRecordingErrors = (errorCode?: ErrorCodes) => {
    setErrors((prev) => ({
      ...prev,
      recordingErrors: errorCode ? { ...prev.recordingErrors, [errorCode]: true } : {},
    }));
  };

  const setLiveStreamingErrors = (errorCode?: ErrorCodes) => {
    setErrors((prev) => ({
      ...prev,
      liveStreamingErrors: errorCode ? { ...prev.liveStreamingErrors, [errorCode]: true } : {},
    }));
  };

  const removeSdkErrors = (error?: ErrorCodes) => removeError({ error, level: 'sdkErrors' });

  const removeError = ({ error, level }: { error?: ErrorCodes; level?: keyof Errors }) => {
    if (error && level) {
      const levelErrors = { ...errors[level] };
      delete levelErrors[error];
      return setErrors((prev) => ({ ...prev, [level]: levelErrors }));
    }
    if (level) {
      return setErrors((prev) => ({ ...prev, [level]: initialErrors[level] }));
    }
    return setErrors(initialErrors);
  };

  const onMessageReceived = (participant: Participant, message: string) => {
    setMessageData({
      sender: participant,
      message: JSON.parse(message),
    });
  };

  useEffect(() => {
    if (messageData.message?.text === AudioProcessingMessages.MUSIC_MODE_STARTED) {
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [messageData.sender?.id as string]: {
            ...participantsStatus[messageData.sender?.id as string],
            isRemoteMusicMode: true,
          },
        };
      });
    } else if (messageData.message?.text === AudioProcessingMessages.MUSIC_MODE_STOPPED) {
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [messageData.sender?.id as string]: {
            ...participantsStatus[messageData.sender?.id as string],
            isRemoteMusicMode: false,
          },
        };
      });
    }
  }, [messageData]);

  const clearMessage = () => {
    setMessageData({
      sender: null,
      message: null,
    });
  };

  useEffect(() => {
    const unsubscribers: Array<() => void> = [
      conferenceService.onConferenceStatusChange(onConferenceStatusChange),
      conferenceService.onStreamsChange(onStreamsChange),
      conferenceService.onScreenShareChange(onScreenShareStart, onScreenShareStop),
      commandService.onMessageReceived(onMessageReceived),
      recordingService.onStatusUpdated(onRecordingStatusUpdated),
    ];
    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [participant]);

  useEffect(() => {
    return conferenceService.onParticipantsChange(onParticipantsChange);
  }, [isPageMuted, liveStreamingData, participants, participant]);

  useEffect(() => {
    let unsubscribe: () => void;
    if (!conference) {
      unsubscribe = conferenceService.onLocalVideoUpdated(onVideoUpdated);
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [localCamera, conference]);

  const showNotification = (notification: NotificationBase) => {
    const id = Date.now() * Math.random();
    setNotifications((prev) => [{ ...notification, id }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const startBackgroundBlur = async () => {
    await conferenceService.startBackgroundBlur();
    setIsBlurred(true);
  };

  const stopVideoProcessing = async () => {
    await conferenceService.stopVideoProcessing();
    setIsBlurred(false);
  };

  useEffect(() => {
    const sdkErrorsHandler = async (error: Error) => {
      if (
        error.name === ErrorCodes.PeerConnectionDisconnectedError &&
        !errors.sdkErrors.PeerConnectionDisconnectedError
      ) {
        setErrors((prev) => ({
          ...prev,
          sdkErrors: { ...prev.sdkErrors, [ErrorCodes.PeerConnectionDisconnectedError]: true },
        }));
      } else if (error.message.includes(ErrorCodes.IncorrectSession)) {
        setErrors((prev) => ({
          ...prev,
          sdkErrors: { ...prev.sdkErrors, [ErrorCodes.IncorrectSession]: true },
        }));
      } else if (error.message.includes(ErrorCodes.CouldNotStartVideoSource)) {
        log(LogLevel.warn, 'Could not start video source - Retrying');
        setErrors((prev) => ({
          ...prev,
          sdkErrors: { ...prev.sdkErrors, [ErrorCodes.CouldNotStartVideoSource]: true },
        }));
      } else {
        throw error;
      }
    };
    const subscription = conferenceService.onConferenceError(sdkErrorsHandler);
    return () => {
      subscription();
    };
  }, []);

  useEffect(() => {
    if (errors.sdkErrors['Could not start video source']) {
      retries += 1;
      retryVideo();
    }
  }, [errors]);

  /*
   * This is retry mechanism for swap cameras on some android devices.
   * Right now we're sometimes getting error from browser api while trying to swap cameras
   */
  const retryVideo = async () => {
    setErrors((prev) => ({
      ...prev,
      sdkErrors: { ...prev.sdkErrors, [ErrorCodes.CouldNotStartVideoSource]: false },
    }));
    if (retries < 3) {
      log(LogLevel.info, 'Retrying to start video');
      const videoTrack = await conferenceService.startLocalVideo({ deviceId: localCamera?.deviceId, isBlurred });
      setLocalStream(videoTrack && new MediaStream([videoTrack]));
      retries = 0;
    }
  };

  const getAudioCaptureMode = async () => {
    if (!isAudio) {
      log(LogLevel.warn, 'Audio is disabled');
      if (audioMode) {
        return audioMode;
      }
      throw new Error('There is no mode available');
    } else {
      const mode = await conferenceService.getCaptureMode();
      setAudioMode(mode);
      return mode;
    }
  };

  const setAudioCaptureMode = async (option: Partial<AudioCaptureModeOptions>) => {
    const preCheck = async () => {
      if (!audioMode) {
        return getAudioCaptureMode();
      }
      return audioMode;
    };

    if (!isAudio) {
      return log(LogLevel.warn, 'Audio is disabled');
    }

    const currentMode = await preCheck();

    if (currentMode) {
      const mergedOptions = {
        mode: option.mode || currentMode.mode,
        modeOptions: { ...currentMode.modeOptions, ...option.modeOptions },
      };
      try {
        await conferenceService.setCaptureMode(mergedOptions);
        return setAudioMode(mergedOptions);
      } catch (err: any) {
        const message = errorMapper(err);
        if (message) {
          setErrors((prev) => ({
            ...prev,
            audioCapture: { ...prev.audioCapture, [message]: true },
          }));
        }
      }
    }
    throw new Error('Problem with setting audio mode');
  };

  const setVideoForwarding = async (maxVideoForwarding: number, option?: VideoForwardingOptions) => {
    await conferenceService.setVideoForwarding({
      strategy: VideoForwardingStrategy.LastSpeaker,
      ...option,
      max: maxVideoForwarding,
    });
    setMaxVideoForwarding(maxVideoForwarding);
  };

  const contextValue: CommsContextType = useMemo(() => {
    return {
      openSession,
      closeSession,
      createConference,
      fetchConference,
      joinConference,
      leaveConference,
      participant,
      conference,
      conferenceStatus,
      participants: participantsArray,
      participantsStatus,
      isAudio,
      // participant?.id && participantsStatus[participant.id]
      //   ? !!participantsStatus[participant.id]?.isLocalAudio
      //   : isAudio,
      toggleAudio,
      playBlockedAudio,
      startParticipantAudio,
      stopParticipantAudio,
      startRemoteParticipantVideo,
      stopRemoteParticipantVideo,
      isVideo:
        participant?.id && participantsStatus[participant.id] ? !!participantsStatus[participant.id]?.isVideo : isVideo,
      toggleVideo,
      addIsSpeakingListener,
      resetVideo,
      resetAudio,
      prevConference,
      localCamera,
      setLocalCamera,
      localMicrophone,
      setLocalMicrophone,
      localSpeakers,
      setLocalSpeakers,
      blockedAudioState,
      setBlockedAudioState,
      isPageMuted,
      toggleMuteParticipants,
      startScreenShare,
      stopScreenShare,
      screenSharingData,
      setSharingErrors,
      setRecordingErrors,
      setLiveStreamingErrors,
      showNotification,
      notifications,
      removeNotification,
      sendMessage,
      messageData,
      clearMessage,
      setPendingTakeoverRequest,
      errors,
      removeError,
      resetScreenSharingData,
      resetRecordingData,
      removeSdkErrors,
      hasCameraPermission,
      hasMicrophonePermission,
      setHasCameraPermission,
      setHasMicrophonePermission,
      startBackgroundBlur,
      stopVideoProcessing,
      recordingData,
      stopRecording,
      startRecording,
      isBlurred,
      setIsBlurred,
      liveStreamingData,
      setLiveStreamingData,
      stopLiveStreaming,
      startLiveStreaming,
      resetLiveStreamingData,
      getAudioCaptureMode,
      setAudioCaptureMode,
      audioMode,
      startLocalVideo: conferenceService.startLocalVideo,
      stopLocalVideo: conferenceService.stopLocalVideo,
      setLocalStream,
      localStream,
      isSessionOpened: sessionService.isOpen,
      setVideoForwarding,
      maxVideoForwarding,
      // For additional errors provide proper pointers
      ...value,
    };
  }, [
    participant,
    conference,
    participantsArray,
    participantsStatus,
    conferenceStatus,
    isAudio,
    isVideo,
    prevConference,
    localCamera,
    setLocalCamera,
    localMicrophone,
    setLocalMicrophone,
    localSpeakers,
    setLocalSpeakers,
    blockedAudioState,
    isPageMuted,
    toggleMuteParticipants,
    screenSharingData,
    notifications,
    messageData,
    errors,
    hasCameraPermission,
    hasMicrophonePermission,
    recordingData,
    isBlurred,
    liveStreamingData,
    localStream,
  ]);

  return (
    <CommsContext.Provider value={contextValue}>
      {dioWindow.dolbyio.isInitialized ? children : ''}
    </CommsContext.Provider>
  );
};

export default CommsProvider;
