import { useContext } from 'react';

import { LogContext } from '../providers/LogProvider';

const useLogContext = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogger hook must be used within a LogProvider');
  }
  return context;
};

export default useLogContext;
