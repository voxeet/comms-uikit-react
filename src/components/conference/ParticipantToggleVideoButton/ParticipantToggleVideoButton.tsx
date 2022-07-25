/* eslint-disable react/jsx-props-no-spreading */
import type { Participant as ParticipantType } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import useParticipants from '../../../hooks/useParticipants';
import useVideo from '../../../hooks/useVideo';
import MediaButton, { MediaButtonProps } from '../MediaButton/MediaButton';

type ParticipantToggleVideoButtonProps = Partial<Omit<MediaButtonProps, 'onClick' | 'isActive' | 'isDisabled'>> & {
  participant: ParticipantType;
};

export const ParticipantToggleVideoButton = ({
  participant,
  size = 'm',
  tooltipPosition = 'top',
  activeIcon = 'camera',
  inactiveIcon = 'cameraOff',
  disabledIcon = 'cameraOff',
  testID = 'ParticipantToggleVideoButton',
  ...rest
}: ParticipantToggleVideoButtonProps) => {
  const { participantsStatus } = useParticipants();
  const { startParticipantVideo, stopParticipantVideo } = useVideo();

  const { isVideo } = participantsStatus[participant.id] || {};

  const handleToggleVideo = async () => {
    if (isVideo) {
      await stopParticipantVideo(participant);
    } else {
      startParticipantVideo(participant);
    }
  };

  return (
    <MediaButton
      tooltipPosition={tooltipPosition}
      activeIcon={activeIcon}
      inactiveIcon={inactiveIcon}
      disabledIcon={disabledIcon}
      isActive={isVideo}
      isDisabled={!participant}
      onClick={handleToggleVideo}
      size={size}
      testID={testID}
      {...rest}
    />
  );
};

export default ParticipantToggleVideoButton;
