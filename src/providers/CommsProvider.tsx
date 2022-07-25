import type { ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions, ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

import type { ParticipantStatus } from '../hooks/types/Participants';
import conferenceService from '../services/conference';
import sdkService from '../services/sdk';
import sessionService from '../services/session';

import '../style/font.css';

type DolbyIoWindow = {
  dolbyio: {
    isInitialized: boolean;
  };
};

const dioWindow = window as Window & typeof globalThis & DolbyIoWindow;
dioWindow.dolbyio = {
  isInitialized: false,
};

export type CommsContextType = {
  openSession: (participantInfo: ParticipantInfo) => Promise<void>;
  closeSession: () => Promise<void>;
  createConference: (options: ConferenceOptions) => Promise<Conference>;
  joinConference: (conference: Conference, options: JoinOptions) => Promise<Conference>;
  leaveConference: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  isAudio: boolean;
  toggleVideo: () => Promise<void>;
  isVideo: boolean;
  startParticipantAudio: (participant: Participant) => Promise<void>;
  stopParticipantAudio: (participant: Participant) => Promise<void>;
  startParticipantVideo: (participant: Participant) => Promise<void>;
  stopParticipantVideo: (participant: Participant) => Promise<void>;
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
};

export const CommsContext = createContext<CommsContextType>({} as CommsContextType);

const CommsProvider = ({ children, token, refreshToken, value }: CommsProviderProps) => {
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

  const participantsArray = useMemo(() => {
    return Array.from(participants.values());
  }, [participants]);

  useEffect(() => {
    const map: CommsContextType['participantsStatus'] = {};
    setParticipantsStatus((prev) => {
      participantsArray.forEach((p) => {
        map[p.id] = {
          isSpeaking: !!participantsStatus[p.id]?.isSpeaking,
          isLocal: p.id === participant?.id,
          isRemoteAudio: p.id === participant?.id ? p.audioTransmitting : p.audioReceivingFrom,
          isLocalAudio: prev[p.id] ? prev[p.id].isLocalAudio : true,
          isVideo: p.streams[p.streams.length - 1]?.getVideoTracks().length > 0,
        };
      });
      return map;
    });
  }, [participantsArray, participant]);

  useEffect(() => {
    if (participant && participant.info.name && conference) {
      setPrevConference({
        participant: participant.info.name,
        name: conference.alias,
      });
    }
  }, [participant, conference]);

  const openSession = async (participantInfo: ParticipantInfo): Promise<void> => {
    if (sessionService.isOpen()) return;

    const timeoutPromise = setTimeout(async () => {
      await sessionService.close();
    }, 5000);
    try {
      await sessionService.open(participantInfo);
      clearTimeout(timeoutPromise);
      setParticipant(sessionService.getParticipant());
    } catch {
      clearTimeout(timeoutPromise);
      setParticipant(null);
    }
  };

  const closeSession = async (): Promise<void> => {
    await sessionService.close();
    setParticipant(null);
  };

  const startParticipantAudio = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.startAudio(p);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participant.id]: {
            ...participantsStatus[participant.id],
            isLocalAudio: true,
          },
        };
      });
    }
  };

  const stopParticipantAudio = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.stopAudio(p);
      setParticipantsStatus((participantsStatus) => {
        return {
          ...participantsStatus,
          [participant.id]: {
            ...participantsStatus[participant.id],
            isLocalAudio: false,
          },
        };
      });
    }
  };

  const toggleAudio = async (): Promise<void> => {
    if (participant) {
      const localUser = conferenceService.participants().get(participant.id);
      if (localUser) {
        if (localUser.audioTransmitting) {
          setIsAudio(false);
          await stopParticipantAudio(localUser);
        } else {
          setIsAudio(true);
          await startParticipantAudio(localUser);
        }
      }
    } else {
      setIsAudio((audio) => !audio);
    }
  };

  const startParticipantVideo = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.startVideo(p);
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

  const stopParticipantVideo = async (participant: Participant): Promise<void> => {
    const p = conferenceService.participants().get(participant.id);
    if (p) {
      await conferenceService.stopVideo(p);
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
        if (localUser.streams[localUser.streams.length - 1]?.getVideoTracks().length > 0) {
          setIsVideo(false);
          await conferenceService.stopVideo(participant);
        } else {
          setIsVideo(true);
          await conferenceService.startVideo(participant);
        }
      }
    } else {
      setIsVideo((video) => !video);
    }
  };

  // CONFERENCE METHODS

  const createConference = useCallback((conferenceOptions: ConferenceOptions): Promise<Conference> => {
    return conferenceService.create(conferenceOptions);
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
  }, []);

  const resetVideo = () => {
    setIsVideo(true);
  };

  const resetAudio = () => {
    setIsAudio(true);
  };

  const addIsSpeakingListener = (participant: Participant) => {
    const interval = setInterval(() => {
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
    }, 500);
    return () => {
      clearInterval(interval);
    };
  };

  // ADDING EVENT HANDLERS

  const onConferenceStatusChange = (status: ConferenceStatus) => {
    setConferenceStatus(status);
  };

  const onParticipantsChange = (participant: Participant) => {
    setParticipants((participants) => {
      const p = participants.get(participant.id);
      return new Map(
        participants.set(participant.id, {
          ...p,
          ...participant,
          audioReceivingFrom: participant.audioReceivingFrom,
        } as Participant),
      );
    });
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

  // const onPermissionsChange = (permissions: ConferencePermission[]) => {
  //   // eslint-disable-next-line no-console
  //   console.log('PERMISSIONS UPDATED EVENT DATA: \n', JSON.stringify(permissions, null, 2));
  // };

  useEffect(() => {
    const unsubscribers: Array<() => void> = [
      conferenceService.onConferenceStatusChange(onConferenceStatusChange),
      conferenceService.onParticipantsChange(onParticipantsChange),
      conferenceService.onStreamsChange(onStreamsChange),
      // conferenceService.onPermissionsChange(onPermissionsChange),
    ];
    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, []);

  const contextValue: CommsContextType = useMemo(() => {
    return {
      openSession,
      closeSession,
      createConference,
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
      startParticipantAudio,
      stopParticipantAudio,
      startParticipantVideo,
      stopParticipantVideo,
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
  ]);

  return (
    <CommsContext.Provider value={contextValue}>
      {dioWindow.dolbyio.isInitialized ? children : ''}
    </CommsContext.Provider>
  );
};

export default CommsProvider;
