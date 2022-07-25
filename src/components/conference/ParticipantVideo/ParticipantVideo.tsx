/* eslint-disable react/jsx-props-no-spreading */

import VideoView, { VideoViewProps } from '../../ui/VideoView/VideoView';

type ParticipantVideoProps = Partial<Omit<VideoViewProps, 'isMirrored'>>;

const ParticipantVideo = ({ participant, ...rest }: ParticipantVideoProps) => {
  if (!participant) return null;

  return <VideoView participant={participant} {...rest} />;
};

export default ParticipantVideo;
