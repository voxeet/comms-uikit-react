/* eslint-disable no-alert */
import type { ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { MediaStreamWithType } from '@voxeet/voxeet-web-sdk/types/models/MediaStream';
import type { JoinOptions, ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import type Recording from '@voxeet/voxeet-web-sdk/types/models/Recording';
import React, { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

import { BlockedAudioState } from '../hooks/types/Audio';
import { LogLevel } from '../hooks/types/Logger';
import { Status } from '../hooks/types/misc';
import type { Notification, NotificationBase } from '../hooks/types/Notifications';
import type { ParticipantStatus } from '../hooks/types/Participants';
import type { ScreenShare } from '../hooks/types/ScreenShare';
import useLogger from '../hooks/useLogger';
import commandService from '../services/command';
import conferenceService from '../services/conference';
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

type ScreenShareStatusType = {
  owner: Participant | null;
  stream: MediaStreamWithType | null;
  status: ScreenShare['status'];
  isPendingTakeoverRequest: boolean;
  isPresentationModeActive: boolean;
};

type MessageData = {
  sender: Participant | null;
  message: string | null;
};

type RecordingDataType = {
  ownerId: string | null;
  timestamp: number | null;
  status: Status;
  isRecordingModeActive: boolean;
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
  screenShareStatus: ScreenShareStatusType;
  recordingData: RecordingDataType;
  setSharingErrors: (error?: ErrorCodes) => void;
  setRecordingErrors: (error?: ErrorCodes) => void;
  showNotification: (notification: NotificationBase) => void;
  notifications: Notification[];
  removeNotification: (notificationId: number) => void;
  screenShareErrorMessages: ErrorCodes[];
  recordingErrorMessages: ErrorCodes[];
  sendMessage: (message: string) => Promise<void>;
  messageData: MessageData;
  clearMessage: () => void;
  setPendingTakeoverRequest: (pendingTakeoverRequest: boolean) => void;
  resetScreenShareStatus: () => void;
  resetRecordingData: () => void;
  errors: Errors;
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
export type Errors = {
  recordingErrors: ErrorCodes[];
  screenShareErrors: ErrorCodes[];
  sdkErrors: Partial<Record<ErrorCodes, boolean>>;
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
  'PeerConnectionDisconnectedError' = 'PeerConnectionDisconnectedError',
}

/*
 * For storing users previously muted , in case of page mute trigger.
 */

const singleParticipantMutedSet = new Set();

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
    default:
      return undefined;
  }
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

  const [localCamera, setLocalCamera] = useState<CommsContextType['localCamera']>(null);
  const [localMicrophone, setLocalMicrophone] = useState<CommsContextType['localMicrophone']>(null);
  const [localSpeakers, setLocalSpeakers] = useState<CommsContextType['localSpeakers']>(null);

  const [blockedAudioState, setBlockedAudioState] = useState<BlockedAudioState>(BlockedAudioState.INACTIVATED);
  const [isPageMuted, setIsPageMuted] = useState(false);
  const [screenShareStatus, setScreenShareStatus] = useState<ScreenShareStatusType>({
    owner: null,
    stream: null,
    status: Status.Other,
    isPendingTakeoverRequest: false,
    isPresentationModeActive: false,
  });
  const [recordingData, setRecordingData] = useState<RecordingDataType>({
    ownerId: null,
    timestamp: null,
    status: Status.Other,
    isRecordingModeActive: false,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // We should expand this with specific context errors
  const [errors, setErrors] = useState<Errors>({
    recordingErrors: [],
    screenShareErrors: [],
    sdkErrors: {},
  });
  const [messageData, setMessageData] = useState<MessageData>({ sender: null, message: null });
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const { log } = useLogger();

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
          isRemoteAudio: isLocal ? p.audioTransmitting : p.audioReceivingFrom,
          isLocalAudio: isLocal ? isAudio : remoteLocalAudioStatus(),
          isVideo: isLocal ? isVideoFromStreamEnabled && isVideo : isVideoFromStreamEnabled,
        };
      });
      return map;
    });
  }, [participantsArray, participant, isVideo]);

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
    if (participant) {
      const localUser = conferenceService.participants().get(participant.id);
      if (localUser) {
        if (localUser.audioTransmitting) {
          log(LogLevel.info, 'Muting local user');
          setIsAudio(false);
          await stopParticipantAudio(localUser);
        } else {
          log(LogLevel.info, 'Unmuting local user');
          setIsAudio(true);
          await startParticipantAudio(localUser);
        }
      }
    } else {
      setIsAudio((audio) => !audio);
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
    if (participant) {
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
          await conferenceService.startLocalVideo(isBlurred);
          log(LogLevel.info, "Turning on local user's video");
          setIsVideo(true);
        }
      }
    } else {
      log(LogLevel.info, 'Turning off video for remote participant');
      setIsVideo((video) => !video);
    }
  };

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
    await closeSession();
    setConference(null);
    setParticipantsStatus({});
    setConferenceStatus(null);
    setParticipants(new Map());
    setIsBlurred(false);
  }, []);

  const resetVideo = () => {
    setIsVideo(true);
  };

  const resetAudio = () => {
    setIsAudio(true);
  };

  const startScreenShare = async () => {
    setScreenShareStatus((prev) => ({
      ...prev,
      status: Status.Loading,
    }));
    setErrors((prev) => ({ ...prev, screenShareErrors: [] }));
    try {
      await conferenceService.startScreenShare();

      setScreenShareStatus((prev) => ({
        ...prev,
        owner: participant,
        isPresentationModeActive: true,
      }));
      return true;
    } catch (error) {
      const message = errorMapper(error);
      if (message) {
        setErrors((prev) => ({ ...prev, screenShareErrors: [message, ...prev.screenShareErrors] }));
      }
      if (message === ErrorCodes.LackOfBrowserPermissions || message === ErrorCodes.ScreenShareAutoTakeoverError) {
        setScreenShareStatus((prev) => ({
          ...prev,
          owner: null,
          status: Status.Other,
          isPresentationModeActive: false,
        }));
      } else {
        setScreenShareStatus((prev) => ({
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
      setScreenShareStatus((prev) => ({
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
    setErrors((prev) => ({ ...prev, recordingErrors: [] }));
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
        console.log(error.message);
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
      console.log(error);
      return false;
    }
  };

  const resetScreenShareStatus = () => {
    setScreenShareStatus((prev) => ({
      ...prev,
      stream: null,
      owner: null,
      status: Status.Other,
      isPresentationModeActive: false,
    }));
  };

  const resetRecordingData = () => {
    setRecordingData((prev) => ({
      ...prev,
      ownerId: null,
      timestamp: null,
      status: Status.Other,
      isRecordingModeActive: false,
    }));
  };

  const sendMessage = async (message: string) => {
    try {
      await commandService.send(message);
    } catch (error) {
      if (error instanceof Error) {
        alert('Send message error!');
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

  const onParticipantsChange = async (participant: Participant) => {
    const p = participants.get(participant.id);
    setParticipants((participants) => {
      return new Map(
        participants.set(participant.id, {
          ...p,
          ...participant,
          audioReceivingFrom: participant.audioReceivingFrom,
        } as Participant),
      );
    });
    if (!p && isPageMuted) {
      await stopParticipantAudio(participant, true);
    }
  };

  const onStreamsChange = (participant: Participant) => {
    setParticipants((participants) => {
      const p = participants.get(participant.id);
      if (p) {
        return new Map(
          participants.set(participant.id, {
            ...p,
            ...participant,
            audioReceivingFrom: participant.audioReceivingFrom,
          } as Participant),
        );
      }
      return participants;
    });
  };

  const onScreenShareStart = (participant: Participant, stream: MediaStreamWithType) => {
    if (stream.type === 'ScreenShare') {
      try {
        setErrors((prev) => ({ ...prev, screenShareErrors: [] }));
        setScreenShareStatus((prev) => ({
          ...prev,
          owner: participant,
          stream,
          status: Status.Active,
        }));
        log(LogLevel.info, `Owner ${participant.info.name} finished their screen share stream.`);
      } catch (error) {
        const message = errorMapper(error);
        if (message) setSharingErrors(errorMapper(message));
        setScreenShareStatus((prev) => ({
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
        setErrors((prev) => ({ ...prev, screenShareErrors: [] }));
        setScreenShareStatus((prev) => ({
          ...prev,
          owner: null,
          stream: null,
          status: Status.Other,
        }));
      } catch (error) {
        const message = errorMapper(error);
        if (message) setSharingErrors(errorMapper(message));
        setScreenShareStatus((prev) => ({
          ...prev,
          owner: participant,
          stream,
        }));
      }
    }
  };

  const onRecordingStatusUpdated = (isRecording: boolean, recording: Recording) => {
    try {
      setErrors((prev) => ({ ...prev, recordingErrors: [] }));
      setRecordingData((prev) => ({
        ...prev,
        ownerId: recording ? recording.participantId : null,
        timestamp: recording ? recording.startTimestamp : null,
        status: isRecording ? Status.Active : Status.Other,
      }));
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      const message = errorMapper(error);
      if (message) setRecordingErrors(errorMapper(message));
    }
  };

  const setPendingTakeoverRequest = (isPendingTakeoverRequest: boolean) => {
    setScreenShareStatus((prev) => ({
      ...prev,
      isPendingTakeoverRequest,
    }));
  };

  const setSharingErrors = (errorCode?: ErrorCodes) => {
    setErrors((prev) => ({ ...prev, screenShareErrors: errorCode ? [errorCode, ...prev.screenShareErrors] : [] }));
  };

  const setRecordingErrors = (errorCode?: ErrorCodes) => {
    setErrors((prev) => ({ ...prev, recordingErrors: errorCode ? [errorCode, ...prev.recordingErrors] : [] }));
  };

  const removeSdkErrors = (error?: ErrorCodes) => {
    let newErrors: Errors['sdkErrors'];
    if (error) {
      newErrors = { ...errors.sdkErrors };
      delete newErrors[error];
    } else {
      newErrors = {};
    }
    setErrors((prev) => ({ ...prev, sdkErrors: newErrors }));
  };

  const onMessageReceived = (participant: Participant, message: string) => {
    setMessageData({
      sender: participant,
      message,
    });
  };

  const clearMessage = () => {
    setMessageData({
      sender: null,
      message: null,
    });
  };
  // const onPermissionsChange = (permissions: ConferencePermission[]) => {
  //   // eslint-disable-next-line no-console
  //   console.log('PERMISSIONS UPDATED EVENT DATA: \n', JSON.stringify(permissions, null, 2));
  // };

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
  }, []);

  useEffect(() => {
    return conferenceService.onParticipantsChange(onParticipantsChange);
  }, [isPageMuted]);

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
      }
      if (error.message.includes(ErrorCodes.IncorrectSession)) {
        setErrors((prev) => ({
          ...prev,
          sdkErrors: { ...prev.sdkErrors, [ErrorCodes.IncorrectSession]: true },
        }));
      }
    };

    const subscription = conferenceService.onConferenceError(sdkErrorsHandler);

    return () => {
      subscription();
    };
  }, []);

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
      isAudio:
        participant?.id && participantsStatus[participant.id]
          ? !!participantsStatus[participant.id]?.isRemoteAudio
          : isAudio,
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
      screenShareStatus,
      setSharingErrors,
      setRecordingErrors,
      showNotification,
      notifications,
      removeNotification,
      sendMessage,
      messageData,
      clearMessage,
      setPendingTakeoverRequest,
      screenShareErrorMessages: errors.screenShareErrors,
      recordingErrorMessages: errors.recordingErrors,
      errors,
      // For additional errors provide proper pointers
      resetScreenShareStatus,
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
    screenShareStatus,
    notifications,
    messageData,
    errors,
    hasCameraPermission,
    hasMicrophonePermission,
    startBackgroundBlur,
    stopVideoProcessing,
    recordingData,
    isBlurred,
  ]);

  return (
    <CommsContext.Provider value={contextValue}>
      {dioWindow.dolbyio.isInitialized ? children : ''}
    </CommsContext.Provider>
  );
};

export default CommsProvider;
