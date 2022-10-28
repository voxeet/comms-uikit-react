import type { UseBlur } from './types/Blur';
import useCommsContext from './useCommsContext';

const useBlur: UseBlur = () => {
  const { isBlurred, startBackgroundBlur, stopVideoProcessing } = useCommsContext();

  return { isBlurred, startBackgroundBlur, stopVideoProcessing };
};

export default useBlur;
