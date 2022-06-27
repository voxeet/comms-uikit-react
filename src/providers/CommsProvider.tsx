import type { ConferencePermission, ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type ConferenceOptions from '@voxeet/voxeet-web-sdk/types/models/ConferenceOptions';
import type { JoinOptions, ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

import conferenceService from '../services/conference';
import sdkService from '../services/sdk';
import sessionService from '../services/session';
import type { ParticipantStatus } from '../hooks/types/Participants';

type DolbyIoWindow = {
  dolbyio: {
    isInitialized: boolean;
  };
}

const dioWindow = window as Window & typeof globalThis & DolbyIoWindow;
dioWindow.dolbyio = {
  isInitialized: false,
};

type CommsContext = {
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
  participant: Participant | null;
  conference: Conference | null;
  conferenceStatus: ConferenceStatus | null;
  participants: Participant[];
  participantsStatus: {
    [key: string]: ParticipantStatus;
  };
  addIsSpeakingListener: (participant: Participant) => () => void;
  isLocalVideoLoading: boolean;
  isLocalAudioLoading: boolean;
  resetVideo: () => void;
  resetAudio: () => void;
};

type CommsProviderProps = {
  children: ReactNode;

  /**
   * Client access token to use to initialize the SDK.
   */
  token: string;

  /**
   * Function to use to refresh the client access token.
   */
  refreshToken: () => Promise<string>;
};

export const CommsContext = createContext<CommsContext>({} as CommsContext);

const CommsProvider = ({ children, token, refreshToken }: CommsProviderProps) => {
  const [participant, setParticipant] = useState<CommsContext['participant']>(null);
  const [conference, setConference] = useState<CommsContext['conference']>(null);
  const [participantsStatus, setParticipantsStatus] = useState<CommsContext['participantsStatus']>({});
  const [conferenceStatus, setConferenceStatus] = useState<CommsContext['conferenceStatus']>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [isAudio, setIsAudio] = useState<boolean>(true);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [isLocalVideoLoading, setIsLocalVideoLoading] = useState(false);
  const [isLocalAudioLoading, setIsLocalAudioLoading] = useState(false);

  // INITIALIZATION

  useEffect(() => {
    if (!dioWindow.dolbyio.isInitialized) {
      if (token && refreshToken) {
        sdkService.initializeToken(token, refreshToken);
        dioWindow.dolbyio.isInitialized = true;
      } else {
        // eslint-disable-next-line no-console
        console.error('Initialization parameters missing.');
      }
    }
  }, [token, refreshToken]);

  useEffect(() => {
    const map: CommsContext['participantsStatus'] = {};
    setParticipantsStatus((prev) => {
      participants.forEach((p) => {
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
  }, [participants, participant]);

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
          setIsLocalAudioLoading(true);
          await stopParticipantAudio(localUser);
          setIsLocalAudioLoading(false);
          setIsAudio(false);
        } else {
          setIsLocalAudioLoading(true);
          await startParticipantAudio(localUser);
          setIsLocalAudioLoading(false);
          setIsAudio(true);
        }
      }
    } else {
      setIsAudio((audio) => !audio);
    }
  };

  const toggleVideo = async (): Promise<void> => {
    if (participant) {
      const localUser = conferenceService.participants().get(participant.id);
      if (localUser) {
        if (localUser.streams[localUser.streams.length - 1]?.getVideoTracks().length > 0) {
          setIsLocalVideoLoading(true);
          await conferenceService.stopVideo(participant);
          setIsLocalVideoLoading(false);
          setIsVideo(false);
        } else {
          setIsLocalVideoLoading(true);
          await conferenceService.startVideo(participant);
          setIsLocalVideoLoading(false);
          setIsVideo(true);
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

  const onPermissionsChange = (permissions: ConferencePermission[]) => {
    // eslint-disable-next-line no-console
    console.log('PERMISSIONS UPDATED EVENT DATA: \n', JSON.stringify(permissions, null, 2));
  };

  useEffect(() => {
    const unsubscribers: Array<() => void> = [
      conferenceService.onConferenceStatusChange(onConferenceStatusChange),
      conferenceService.onParticipantsChange(onParticipantsChange),
      conferenceService.onStreamsChange(onStreamsChange),
      conferenceService.onPermissionsChange(onPermissionsChange),
    ];
    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, []);

  const contextValue: CommsContext = useMemo(
    () => ({
      openSession,
      closeSession,
      createConference,
      joinConference,
      leaveConference,
      participant,
      conference,
      conferenceStatus,
      participants: Array.from(participants.values()),
      participantsStatus,
      isAudio: participant?.id && participantsStatus[participant.id] ? !!participantsStatus[participant.id]?.isRemoteAudio : isAudio,
      toggleAudio,
      startParticipantAudio,
      stopParticipantAudio,
      isVideo: participant?.id && participantsStatus[participant.id] ? !!participantsStatus[participant.id]?.isVideo : isVideo,
      toggleVideo,
      addIsSpeakingListener,
      isLocalVideoLoading,
      isLocalAudioLoading,
      resetVideo,
      resetAudio,
    }),
    [
      participant,
      conference,
      participants,
      participantsStatus,
      conferenceStatus,
      isAudio,
      isVideo,
      isLocalVideoLoading,
      isLocalAudioLoading,
    ],
  );

  return (
    <CommsContext.Provider value={contextValue}>{dioWindow.dolbyio.isInitialized ? children : ''}</CommsContext.Provider>
  );
};

export default CommsProvider;
