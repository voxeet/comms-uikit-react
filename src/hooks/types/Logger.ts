export enum LogLevel {
  info = 0,
  warn = 1,
  error = 2,
}
export type Logger = {
  log: (level: LogLevel, message: string, ...optionalParams: unknown[]) => void;
};

export type UseLogger = () => Logger;
