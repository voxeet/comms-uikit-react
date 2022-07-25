import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import SDKService from '../services/sdk';

import type { UseSession } from './types/Session';

const useSession: UseSession = () => {
  const { participant, openSession, closeSession } = useContext(CommsContext);

  const getSDKVersion = () => {
    return SDKService.getSDKVersion();
  };

  return {
    participant,
    openSession,
    closeSession,
    getSDKVersion,
  };
};

export default useSession;
