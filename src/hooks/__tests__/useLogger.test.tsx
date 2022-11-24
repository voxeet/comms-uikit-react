import { cleanup, setupHook } from '../../utils/tests/test-utils';
import { LogLevel } from '../types/Logger';
import useLogger from '../useLogger';

beforeEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('useMicrophone', () => {
  test.each(['info', 'warn', 'error'])('test logger level %s', async (level) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const consoleSpy = jest.spyOn(console, level === 'info' ? 'log' : level);
    const hookValues = setupHook(useLogger);
    hookValues.log(LogLevel[level as keyof typeof LogLevel], level);
    expect(consoleSpy).toHaveBeenCalledWith(level);
  });
});
