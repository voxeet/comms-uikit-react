import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';

import useConference from '../../../hooks/useConference';
import useErrors from '../../../hooks/useErrors';
import { errorMapper } from '../../../providers/CommsProvider';
import Button, { ButtonProps } from '../../ui/Button/Button';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type JoinConferenceButtonProps = Partial<Omit<ButtonProps, 'onClick'>> & {
  joinOptions: JoinOptions;
  meetingName: string;
  tooltipText: string;
  tooltipPosition?: TooltipProps['position'];
  /**
   * Callback fired on session initialisation but before joining a conference
   */
  onInitialise?: () => void;
  /**
   * Callback fired on successfully joining a conference
   */
  onSuccess?: (id: string) => void;
  /**
   * Callback fired on rejected attempt to join
   */
  onError?: () => void;
  testID?: string;
};

const JoinConferenceButton = ({
  joinOptions,
  meetingName,
  tooltipText,
  tooltipPosition = 'top',
  onInitialise,
  onSuccess,
  onError,
  testID,
  ...rest
}: JoinConferenceButtonProps) => {
  const { createConference, joinConference } = useConference();
  const { setErrorsExplicitly } = useErrors();

  const handleJoinConference = async () => {
    try {
      if (onInitialise) {
        onInitialise();
      }
      const newConference = await createConference({
        alias: meetingName,
        params: {
          // Keep empty conferences alive for 5 minutes to allow participants to join or rejoin
          ttl: 60 * 5,
          liveRecording: true,
        },
      });
      await joinConference(newConference, joinOptions);
      if (onSuccess) {
        onSuccess(newConference.id);
      }
    } catch (e) {
      const message = errorMapper(e);

      /*
       * Sometimes while joining conference SDK is throwing token error without emitting to subscriber.
       */
      if (message) {
        setErrorsExplicitly({ error: message, context: 'sdkErrors' });
      }
      onError?.();
    }
  };

  return (
    <Tooltip position={tooltipPosition} text={tooltipText}>
      <Button variant="primary" testID={testID} onClick={handleJoinConference} {...rest} />
    </Tooltip>
  );
};

export default JoinConferenceButton;
