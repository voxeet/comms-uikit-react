/* eslint-disable react/jsx-props-no-spreading */

import Avatar, { AvatarProps } from '../../ui/Avatar/Avatar';

type ParticipantAvatarProps = Partial<AvatarProps>;

const ParticipantAvatar = ({ testID, participant, ...rest }: ParticipantAvatarProps) => {
  if (!participant) return null;

  return <Avatar testID={testID} participant={participant} {...rest} />;
};

export default ParticipantAvatar;
