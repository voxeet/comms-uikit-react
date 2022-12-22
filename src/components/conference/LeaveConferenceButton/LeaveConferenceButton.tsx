import { Status } from '../../../hooks/types/misc';
import useConference from '../../../hooks/useConference';
import useRecording from '../../../hooks/useRecording';
import useScreenSharing from '../../../hooks/useScreenSharing';
import IconButton, { IconButtonProps } from '../../ui/IconButton/IconButton';
import Tooltip, { TooltipProps } from '../../ui/Tooltip/Tooltip';

type LeaveConferenceButtonProps = Partial<Omit<IconButtonProps, 'onClick'>> & {
  tooltipText: string;
  tooltipPosition?: TooltipProps['position'];
  onSuccess?: () => void;
  preAction?: () => Promise<boolean> | boolean;
  testID?: string;
};

const LeaveConferenceButton = ({
  tooltipText,
  tooltipPosition = 'top',
  onSuccess,
  preAction,
  testID,
  ...rest
}: LeaveConferenceButtonProps) => {
  const { leaveConference } = useConference();

  const { isLocalUserRecordingOwner, status: recordingStatus, stopRecording } = useRecording();
  const { isLocalUserPresentationOwner, stopScreenShare, status: screenSharingStatus } = useScreenSharing();

  const handleLeaveConference = async () => {
    if (isLocalUserRecordingOwner && recordingStatus === Status.Active) {
      await stopRecording();
    }
    if (isLocalUserPresentationOwner && screenSharingStatus === Status.Active) {
      await stopScreenShare();
    }

    await preAction?.();

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
