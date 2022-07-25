import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

import type { UseVideo } from './types/Video';

const useVideo: UseVideo = () => {
  const { isVideo, toggleVideo, resetVideo, startParticipantVideo, stopParticipantVideo } = useContext(CommsContext);

  return {
    isVideo,
    toggleVideo,
    resetVideo,
    startParticipantVideo,
    stopParticipantVideo,
  };
};

export default useVideo;
