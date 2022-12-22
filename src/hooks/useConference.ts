import type { UseConference } from './types/Conferencing';
import useCommsContext from './useCommsContext';

const useConference: UseConference = () => {
  const {
    conference,
    createConference,
    fetchConference,
    joinConference,
    leaveConference,
    prevConference,
    maxVideoForwarding,
    setVideoForwarding,
  } = useCommsContext();

  return {
    conference,
    createConference,
    fetchConference,
    joinConference,
    leaveConference,
    prevConference,
    maxVideoForwarding,
    setVideoForwarding,
  };
};

export default useConference;
