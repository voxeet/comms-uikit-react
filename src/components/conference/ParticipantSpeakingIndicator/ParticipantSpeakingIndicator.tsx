import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';

import soundWave from '../../../assets/animations/soundWaveLottie.json';
import useParticipants from '../../../hooks/useParticipants';
import type { ColorKey } from '../../../theme/types';
import AnimationIndicator from '../../ui/indicators/AnimationIndicator/AnimationIndicator';
import IconIndicator from '../../ui/indicators/IconIndicator/IconIndicator';

type ParticipantSpeakingIndicatorProps = {
  participant: Participant;
  activeBackgroundColor?: ColorKey;
  inactiveBackgroundColor?: ColorKey;
  mutedBackgroundColor?: ColorKey;
  activeIconColor?: ColorKey;
  inactiveIconColor?: ColorKey;
  mutedIconColor?: ColorKey;
  variant?: 'square' | 'circle';
  testID?: string;
};

const ParticipantSpeakingIndicator = ({
  participant,
  activeBackgroundColor = 'white',
  inactiveBackgroundColor,
  mutedBackgroundColor,
  activeIconColor = 'primary.500',
  inactiveIconColor,
  mutedIconColor,
  variant = 'circle',
  testID,
}: ParticipantSpeakingIndicatorProps) => {
  const { participantsStatus } = useParticipants();
  const status = participantsStatus[participant.id];

  if (!participant || !status) return null;

  const { isSpeaking, isRemoteAudio } = status;

  if (!isRemoteAudio) {
    return (
      <IconIndicator
        testID={`${testID}-muted`}
        icon="microphoneOff"
        backgroundColor={mutedBackgroundColor}
        iconColor={mutedIconColor}
        variant={variant}
      />
    );
  }

  if (isSpeaking) {
    return (
      <AnimationIndicator
        animationData={soundWave}
        testID={`${testID}-speaking`}
        backgroundColor={activeBackgroundColor}
        contentColor={activeIconColor}
        variant={variant}
      />
    );
  }

  return (
    <IconIndicator
      testID={`${testID}-noSpeaking`}
      icon="dotsHorizontal"
      backgroundColor={inactiveBackgroundColor}
      iconColor={inactiveIconColor}
      variant={variant}
    />
  );
};

export default ParticipantSpeakingIndicator;
