/* eslint-disable react/jsx-props-no-spreading */

import useParticipants from '../../../hooks/useParticipants';
import useSession from '../../../hooks/useSession';
import Pill, { PillProps } from '../../ui/Pill/Pill';

type LocalNameProps = Partial<Omit<PillProps, 'active'>>;

const LocalName = ({ text, ...rest }: LocalNameProps) => {
  const { participant } = useSession();
  const { participantsStatus } = useParticipants();

  if (!participant) return null;

  const { isSpeaking, isRemoteAudio, isLocalAudio } = participantsStatus[participant.id] || {};
  return (
    <Pill text={`${participant.info.name} (${text})`} active={isSpeaking && isRemoteAudio && isLocalAudio} {...rest} />
  );
};

export default LocalName;
