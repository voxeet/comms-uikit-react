import type { Participant as ParticipantType } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import useParticipants from '../../../hooks/useParticipants';
import Pill, { PillProps } from '../../ui/Pill/Pill';

type ParticipantNameProps = Partial<Omit<PillProps, 'active' | 'text'>> & {
  participant: ParticipantType;
};

const ParticipantName = ({ participant, ...rest }: ParticipantNameProps) => {
  const { participantsStatus } = useParticipants();

  if (!participant) return null;

  const { isSpeaking, isRemoteAudio } = participantsStatus[participant.id] || {};
  return <Pill text={participant.info.name} active={isSpeaking && isRemoteAudio} {...rest} />;
};

export default ParticipantName;
