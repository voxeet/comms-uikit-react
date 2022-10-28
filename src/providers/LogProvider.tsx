import React, { createContext, useMemo } from 'react';

import { LogLevel } from '../hooks/types/Logger';

export const LogContext = createContext<LogContextType>({
  logLevel: LogLevel,
} as unknown as LogContextType);

export type LogContextType = {
  logLevel: LogLevel;
};

export type LogProviderProps = {
  children: React.ReactNode;
  minLogLevel: LogLevel;
};

const LogProvider = ({ children, minLogLevel }: LogProviderProps) => {
  const contextValue = useMemo(() => {
    return { logLevel: minLogLevel };
  }, []);

  return <LogContext.Provider value={contextValue}>{children}</LogContext.Provider>;
};

export default LogProvider;
