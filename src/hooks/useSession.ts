import SDKService from '../services/sdk';

import type { UseSession } from './types/Session';
import useCommsContext from './useCommsContext';

const useSession: UseSession = () => {
  const { participant, openSession, closeSession, isSessionOpened } = useCommsContext();

  const getSDKVersion = () => {
    return SDKService.getSDKVersion();
  };

  return {
    participant,
    openSession,
    closeSession,
    getSDKVersion,
    isSessionOpened,
  };
};

export default useSession;
