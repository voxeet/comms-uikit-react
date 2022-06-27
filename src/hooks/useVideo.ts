import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import type { UseVideo} from './types/Video';

const useVideo: UseVideo = () => {
  const {
    isVideo,
    toggleVideo,
    isLocalVideoLoading,
    resetVideo
  } = useContext(CommsContext);

  return {
    isVideo,
    toggleVideo,
    isLocalVideoLoading,
    resetVideo,
  };
};

export default useVideo;
