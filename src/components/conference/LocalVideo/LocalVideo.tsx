/* eslint-disable react/jsx-props-no-spreading */

import useSession from '../../../hooks/useSession';
import VideoTile, { VideoTileProps } from '../../ui/VideoTile/VideoTile';

type LocalVideoProps = Partial<Omit<VideoTileProps, 'participant' | 'isMirrored'>>;

const LocalVideo = ({ ...rest }: LocalVideoProps) => {
  const { participant } = useSession();

  if (!participant) return null;

  return <VideoTile participant={participant} isMirrored {...rest} />;
};

export default LocalVideo;
