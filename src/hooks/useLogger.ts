/* eslint-disable no-console */

import type { UseLogger } from './types/Logger';
import { LogLevel } from './types/Logger';
import useLogContext from './useLogContext';

const useLogger: UseLogger = () => {
  const { logLevel } = useLogContext() || LogLevel.info;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (level: LogLevel, message: string, ...optionalParams: any[]) => {
    if (level < logLevel) {
      return;
    }

    switch (level) {
      case LogLevel.warn:
        console.warn(message, ...optionalParams);
        break;
      case LogLevel.error:
        console.error(message, ...optionalParams);
        break;
      case LogLevel.info:
      default:
        console.log(message, ...optionalParams);
        break;
    }
  };
  return { log };
};

export default useLogger;
