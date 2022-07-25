/* eslint-disable react/jsx-props-no-spreading */

import useSession from '../../../hooks/useSession';
import Avatar, { AvatarProps } from '../../ui/Avatar/Avatar';

type LocalAvatarProps = Partial<Omit<AvatarProps, 'participant'>> & {
  username?: string;
};

const LocalAvatar = ({ testID, username, ...rest }: LocalAvatarProps) => {
  const { participant } = useSession();

  if (!participant && !username) return null;

  return <Avatar testID={testID} participant={participant || username} {...rest} />;
};

export default LocalAvatar;
