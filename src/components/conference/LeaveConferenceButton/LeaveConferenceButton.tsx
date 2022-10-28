import { Status as RecordingStatus } from '../../../hooks/types/misc';
import useConference from '../../../hooks/useConference';
import useRecording from '../../../hooks/useRecording';
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

  const { isLocalUserRecordingOwner, status, stopRecording } = useRecording();

  const handleLeaveConference = async () => {
    if (isLocalUserRecordingOwner && status === RecordingStatus.Active) {
      await stopRecording();
    }

    await leaveConference();
    if (onSuccess) {
      onSuccess();
    }
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
