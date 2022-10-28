import { useContext } from 'react';

import { CommsContext } from '../providers/CommsProvider';

const useCommsContext = () => {
  const context = useContext(CommsContext);
  if (context === undefined) {
    throw new Error('UIKit hooks must be used within a CommsProvider');
  }
  return context;
};

export default useCommsContext;
