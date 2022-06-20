import type { ConferencePermission, ConferenceStatus } from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type { JoinOptions, ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

import conferenceService from '../services/conference';
import sdkService from '../services/sdk';
import sessionService from '../services/session';

type ParticipantStatus = {
  isVideo: boolean;
  isSpeaking: boolean;
  isLocal: boolean;
  isRemoteAudio: boolean;
  isLocalAudio: boolean;
};

type CommsContext = {
  openSession: (participantInfo: ParticipantInfo) => Promise<void>;
  closeSession: () => void;
  joinConference: (conference: Conference, options: JoinOptions) => Promise<void>;
  leaveConference: () => Promise<void>;
  toggleAudio: () => void;
  isAudio: boolean;
  toggleVideo: () => void;
  isVideo: boolean;
  startParticipantAudio: (participant: Participant) => Promise<void>;
  stopParticipantAudio: (participant: Participant) => Promise<void>;
  user: Participant | null;
  conference: Conference | null;
  conferenceStatus: ConferenceStatus | null;
  participants: Participant[];
  participantsStatus: {
    [key: string]: ParticipantStatus;
  };
  addIsSpeakingListener: (participant: Participant) => () => void;
  isLocalVideoLoading: boolean;
  resetVideo: () => void;
  resetAudio: () => void;
};

type CommsProviderProps = {
  children: ReactNode;
  token: string;
  refreshToken: () => Promise<string>;
};

export const CommsContext = createContext<CommsContext>({} as CommsContext);

const CommsProvider = ({ children, token, refreshToken }: CommsProviderProps) => {
  const [user, setUser] = useState<CommsContext['user']>(null);
  const [conference, setConference] = useState<CommsContext['conference']>(null);
  const [participantsStatus, setParticipantsStatus] = useState<CommsContext['participantsStatus']>({});
  const [conferenceStatus, setConferenceStatus] = useState<CommsContext['conferenceStatus']>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isAudio, setIsAudio] = useState<boolean>(true);
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const [isLocalVideoLoading, setIsLocalVideoLoading] = useState(false);

  // INITIALIZATION

  useEffect(() => {
    if (token && refreshToken) {
      sdkService.initializeToken(token, refreshToken);
      setIsInitialized(true);
    } else {
      // eslint-disable-next-line no-console
      console.log('No initialization params passed');
    }
  }, [token, refreshToken]);

  useEffect(() => {
    const map: CommsContext['participantsStatus'] = {};
    setParticipantsStatus((prev) => {
      participants.forEach((p) => {
        map[p.id] = {
          isSpeaking: !!participantsStatus[p.id]?.isSpeaking,
          isLocal: p.id === user?.id,
          isRemoteAudio: p.id === user?.id ? p.audioTransmitting : p.audioReceivingFrom,
          isLocalAudio: prev[p.id] ? prev[p.id].isLocalAudio : true,
          isVideo: p.streams[p.streams.length - 1]?.getVideoTracks().length > 0,
        };
      });
      return map;
    });
  }, [participants, user]);

  const openSession = async (participantInfo: ParticipantInfo) => {
    if (sessionService.isOpen()) return;

    const timeoutPromise = setTimeout(async () => {
      await sessionService.close();
    }, 5000);
    try {
      await sessionService.open(participantInfo);
      clearTimeout(timeoutPromise);
      setUser(sessionService.getUser());
    } catch {
      clearTimeout(timeoutPromise);
      setUser(null);
    }
  };

  const closeSession = async () => {
    await sessionService.close();
  };

  const startParticipantAudio = async (participant: Participant) => {
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

  const stopParticipantAudio = async (participant: Participant) => {
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

  const toggleAudio = async () => {
    if (user) {
      const localUser = conferenceService.participants().get(user.id);
      if (localUser) {
        if (localUser.audioTransmitting) {
          await stopParticipantAudio(localUser);
          setIsAudio(false);
        } else {
          await startParticipantAudio(localUser);
          setIsAudio(true);
        }
      }
    } else {
      setIsAudio((audio) => !audio);
    }
  };

  const toggleVideo = async () => {
    if (user) {
      const localUser = conferenceService.participants().get(user.id);
      if (localUser) {
        if (localUser.streams[localUser.streams.length - 1]?.getVideoTracks().length > 0) {
          setIsLocalVideoLoading(true);
          await conferenceService.stopVideo(user);
          setIsLocalVideoLoading(false);
          setIsVideo(false);
        } else {
          setIsLocalVideoLoading(true);
          await conferenceService.startVideo(user);
          setIsLocalVideoLoading(false);
          setIsVideo(true);
        }
      }
    } else {
      setIsVideo((video) => !video);
    }
  };

  // CONFERENCE METHODS

  const joinConference = useCallback(async (conference, joinOptions) => {
    try {
      const joinedConference = await conferenceService.join(conference, joinOptions);
      setConference(joinedConference);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const leaveConference = useCallback(async () => {
    await conferenceService.leave();
    await closeSession();
    setUser(null);
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
      joinConference,
      leaveConference,
      user,
      conference,
      conferenceStatus,
      participants: Array.from(participants.values()),
      participantsStatus,
      isAudio: user?.id && participantsStatus[user.id] ? !!participantsStatus[user.id]?.isRemoteAudio : isAudio,
      toggleAudio,
      startParticipantAudio,
      stopParticipantAudio,
      isVideo: user?.id && participantsStatus[user.id] ? !!participantsStatus[user.id]?.isVideo : isVideo,
      toggleVideo,
      addIsSpeakingListener,
      isLocalVideoLoading,
      resetVideo,
      resetAudio,
    }),
    [user, conference, participants, participantsStatus, conferenceStatus, isAudio, isVideo, isLocalVideoLoading],
  );

  return <CommsContext.Provider value={contextValue}>{isInitialized ? children : ''}</CommsContext.Provider>;
};

export default CommsProvider;
