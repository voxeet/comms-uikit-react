import type { UseVideo } from './types/Video';
import useCommsContext from './useCommsContext';

const useVideo: UseVideo = () => {
  const { isVideo, toggleVideo, resetVideo, startRemoteParticipantVideo, stopRemoteParticipantVideo } =
    useCommsContext();

  return {
    isVideo,
    toggleVideo,
    resetVideo,
    startRemoteParticipantVideo,
    stopRemoteParticipantVideo,
  };
};

export default useVideo;
