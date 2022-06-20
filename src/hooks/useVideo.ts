import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

const useVideo = () => {
  const { isVideo, toggleVideo, isLocalVideoLoading, resetVideo } = useContext(CommsContext);

  return {
    isVideo,
    toggleVideo,
    isLocalVideoLoading,
    resetVideo,
  };
};

export default useVideo;
