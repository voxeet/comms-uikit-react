import type { UseLocalStream } from './types/LocalStream';
import useCommsContext from './useCommsContext';

const useLocalStream: UseLocalStream = () => {
  const { localStream, setLocalStream } = useCommsContext();

  return {
    localStream,
    setLocalStream,
  };
};

export default useLocalStream;
