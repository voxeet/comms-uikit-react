import type { ErrorCodes } from '../providers/CommsProvider';

import type { UseErrors } from './types/Errors';
import useCommsContext from './useCommsContext';

const useErrors: UseErrors = () => {
  const {
    errors: { sdkErrors, screenShareErrors, recordingErrors },
    removeError,
    setContextErrors,
  } = useCommsContext();

  const removeSdkErrors = (error?: ErrorCodes) => removeError({ error, context: 'sdkErrors' });

  return {
    sdkErrors,
    screenShareErrors,
    recordingErrors,
    removeSdkErrors,
    setErrorsExplicitly: setContextErrors,
  };
};

export default useErrors;
