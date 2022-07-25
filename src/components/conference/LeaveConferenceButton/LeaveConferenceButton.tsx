/* eslint-disable react/jsx-props-no-spreading */
import useConference from '../../../hooks/useConference';
import IconButton, { IconButtonProps } from '../../ui/IconButton/IconButton';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type LeaveConferenceButtonProps = Partial<Omit<IconButtonProps, 'onClick'>> & {
  tooltipText: string;
  tooltipPosition?: TooltipProps['position'];
  onSuccess?: () => void;
  testID?: string;
};

const LeaveConferenceButton = ({
  tooltipText,
  tooltipPosition = 'top',
  onSuccess,
  testID,
  ...rest
}: LeaveConferenceButtonProps) => {
  const { leaveConference } = useConference();
  const handleLeaveConference = async () => {
    if (onSuccess) {
      onSuccess();
    }
    await leaveConference();
  };
  return (
    <Tooltip position={tooltipPosition} text={tooltipText}>
      <IconButton
        variant="rectangular"
        icon="handset"
        backgroundColor="red.500"
        testID={testID}
        onClick={handleLeaveConference}
        {...rest}
      />
    </Tooltip>
  );
};

export default LeaveConferenceButton;
