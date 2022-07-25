/* eslint-disable react/jsx-props-no-spreading */

import useSession from '../../../hooks/useSession';
import VideoView, { VideoViewProps } from '../../ui/VideoView/VideoView';

type LocalVideoProps = Partial<Omit<VideoViewProps, 'participant' | 'isMirrored'>>;

const LocalVideo = ({ ...rest }: LocalVideoProps) => {
  const { participant } = useSession();

  if (!participant) return null;

  return <VideoView participant={participant} isMirrored {...rest} />;
};

export default LocalVideo;
