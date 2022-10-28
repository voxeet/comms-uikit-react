import type { UseErrors } from './types/Errors';
import useCommsContext from './useCommsContext';

const useErrors: UseErrors = () => {
  const {
    errors: { sdkErrors, screenShareErrors, recordingErrors },
    removeSdkErrors,
  } = useCommsContext();

  return {
    sdkErrors,
    screenShareErrors,
    recordingErrors,
    removeSdkErrors,
  };
};

export default useErrors;
