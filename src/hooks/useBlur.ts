import { isEdgeOrChromeBrowser } from '../utils/misc';

import type { UseBlur } from './types/Blur';
import useCommsContext from './useCommsContext';

const useBlur: UseBlur = () => {
  const { isBlurred, startBackgroundBlur, stopVideoProcessing } = useCommsContext();

  return { isBlurred, startBackgroundBlur, stopVideoProcessing, isSupported: isEdgeOrChromeBrowser };
};

export default useBlur;
