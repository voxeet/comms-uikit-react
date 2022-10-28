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
  testID?: string;
};

const ParticipantSpeakingIndicator = ({
  participant,
  testID,
  activeBackgroundColor = 'white',
  inactiveBackgroundColor,
  mutedBackgroundColor,
  activeIconColor = 'primary.500',
  inactiveIconColor,
  mutedIconColor,
}: ParticipantSpeakingIndicatorProps) => {
  const { participantsStatus } = useParticipants();

  if (!participant) return null;

  const { isSpeaking, isLocalAudio, isRemoteAudio } = participantsStatus[participant.id] || {};

  if (!isLocalAudio || !isRemoteAudio) {
    return (
      <IconIndicator
        testID={`${testID}-muted`}
        icon="microphoneOff"
        backgroundColor={mutedBackgroundColor}
        iconColor={mutedIconColor}
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
      />
    );
  }

  return (
    <IconIndicator
      testID={`${testID}-noSpeaking`}
      icon="dotsHorizontal"
      backgroundColor={inactiveBackgroundColor}
      iconColor={inactiveIconColor}
    />
  );
};

export default ParticipantSpeakingIndicator;
