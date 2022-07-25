import type Conference from '@voxeet/voxeet-web-sdk/types/models/Conference';
import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import type { ParticipantStatus } from '../../hooks/types/Participants';
import type { CommsContextType } from '../../providers/CommsProvider';

export const createParticipant = ({ name, id }: { name: string; id: string }) => {
  const getVideoTracks = jest.fn(() => []);
  return {
    _events: {},
    _eventsCount: 0,
    info: {
      name,
      avatarUrl: undefined,
      externalId: undefined,
    },
    streams: [
      {
        type: 'Camera',
        getVideoTracks,
      },
    ],
    audioQuality: -1,
    audioTransmitting: true,
    _audioReceivingStopped: true,
    id,
    status: 'Connected',
    type: 'user',
    audioReceivingFrom: false,
  } as unknown as Participant;
};

export const createConference = ({ name, id }: { name: string; id: string }) => {
  return {
    alias: name,
    id,
    isNew: true,
    pinCode: 'FAKEPIN_924d59a4-2380-43f6-bc8e-7ade8549cee3',
  } as unknown as Conference;
};

export const createParticipantStatus = (
  id: string,
  {
    isSpeaking = false,
    isLocal = true,
    isRemoteAudio = true,
    isLocalAudio = true,
    isVideo = true,
  }: Partial<ParticipantStatus>,
) => {
  return {
    [id]: {
      isSpeaking,
      isLocal,
      isRemoteAudio,
      isLocalAudio,
      isVideo,
    },
  } as CommsContextType['participantsStatus'];
};

export const createDevice = (id: string) => {
  return {
    deviceId: id,
    label: id,
    groupId: `group-${id}`,
    kind: id,
  } as MediaDeviceInfo;
};
