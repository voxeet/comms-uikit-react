type ErrorWithMessage = {
  message: string;
};

export const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(typeof maybeError === 'string' ? maybeError : JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

export const throwErrorMessage = (error: unknown) => {
  throw new Error(getErrorMessage(error));
};
