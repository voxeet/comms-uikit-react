import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

import type { UseConference } from './types/Conferencing';

const useConference: UseConference = () => {
  const { conference, createConference, joinConference, leaveConference, prevConference } = useContext(CommsContext);

  return {
    conference,
    createConference,
    joinConference,
    leaveConference,
    prevConference,
  };
};

export default useConference;
