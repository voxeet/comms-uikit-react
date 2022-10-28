import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';

import useConference from '../../../hooks/useConference';
import useSession from '../../../hooks/useSession';
import Button, { ButtonProps } from '../../ui/Button/Button';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type JoinConferenceButtonProps = Partial<Omit<ButtonProps, 'onClick'>> & {
  joinOptions: JoinOptions;
  meetingName: string;
  tooltipText: string;
  tooltipPosition?: TooltipProps['position'];
  username: string;
  /**
   * Callback fired on session initialisation but before joining a conference
   */
  onInitialise?: () => void;
  /**
   * Callback fired on successfully joining a conference
   */
  onSuccess?: (id: string) => void;
  testID?: string;
};

const JoinConferenceButton = ({
  joinOptions,
  meetingName,
  tooltipText,
  tooltipPosition = 'top',
  username,
  onInitialise,
  onSuccess,
  testID,
  ...rest
}: JoinConferenceButtonProps) => {
  const { openSession } = useSession();
  const { createConference, joinConference } = useConference();

  const handleJoinConference = async () => {
    if (onInitialise) {
      onInitialise();
    }

    await openSession({
      name: username,
    });

    const newConference = await createConference({
      alias: meetingName,
    });

    await joinConference(newConference, joinOptions);

    if (onSuccess) {
      onSuccess(newConference.id);
    }
  };
  return (
    <Tooltip position={tooltipPosition} text={tooltipText}>
      <Button variant="primary" testID={testID} onClick={handleJoinConference} {...rest} />
    </Tooltip>
  );
};

export default JoinConferenceButton;
