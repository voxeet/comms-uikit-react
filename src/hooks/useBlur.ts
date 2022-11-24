import type { UseBlur } from './types/Blur';
import useCommsContext from './useCommsContext';

const useBlur: UseBlur = () => {
  const { isBlurred, startBackgroundBlur, stopVideoProcessing } = useCommsContext();

  const isSupported =
    (navigator.userAgent.match(/chrome|chromium/i) || navigator.userAgent.match(/edg/i)) &&
    navigator.userAgent.indexOf('Mobile') === -1;

  return { isBlurred, startBackgroundBlur, stopVideoProcessing, isSupported };
};

export default useBlur;
