import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import SDKService from '../services/sdk';

/**
 * A hook
 * @category Hook
 */
const useSession = () => {
  const { openSession, closeSession, user } = useContext(CommsContext);

  const getSDKVersion = () => {
    return SDKService.getSDKVersion();
  };

  return { user, openSession, closeSession, getSDKVersion };
};

export default useSession;
