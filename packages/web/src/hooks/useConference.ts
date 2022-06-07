import { useCallback, useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';
import conferenceService from '../services/conference';

/**
 * A hook
 * @category Hook
 */
const useConference = () => {
  const { joinConference, conference, leaveConference, closeSession } = useContext(CommsContext);

  const createConference = useCallback(async (conferenceOptions) => {
    return conferenceService.create(conferenceOptions);
  }, []);

  return { joinConference, conference, leaveConference, createConference, closeSession };
};

export default useConference;
