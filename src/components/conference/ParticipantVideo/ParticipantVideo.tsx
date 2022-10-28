import VideoTile, { VideoTileProps } from '../../ui/VideoTile/VideoTile';

type ParticipantVideoProps = Partial<Omit<VideoTileProps, 'isMirrored'>>;

const ParticipantVideo = ({ participant, ...rest }: ParticipantVideoProps) => {
  if (!participant) return null;

  return <VideoTile participant={participant} {...rest} />;
};

export default ParticipantVideo;
