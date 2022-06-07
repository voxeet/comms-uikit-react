import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

/**
 * A hook
 * @category Hook
 */
const useSession = () => {
  const { openSession, closeSession, user } = useContext(CommsContext);

  return { user, openSession, closeSession };
};

export default useSession;
