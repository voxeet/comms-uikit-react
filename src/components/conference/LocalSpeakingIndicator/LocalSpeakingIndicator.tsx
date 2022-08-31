import type { ColorKey } from '../../../common';
import soundWave from '../../../common/assets/lottie/soundWaveLottie.json';

import useParticipants from '../../../hooks/useParticipants';
import useSession from '../../../hooks/useSession';
import AnimationIndicator from '../../ui/indicators/AnimationIndicator/AnimationIndicator';
import IconIndicator from '../../ui/indicators/IconIndicator/IconIndicator';

type LocalSpeakingIndicatorProps = {
  activeBackgroundColor?: ColorKey;
  inactiveBackgroundColor?: ColorKey;
  mutedBackgroundColor?: ColorKey;
  activeIconColor?: ColorKey;
  inactiveIconColor?: ColorKey;
  mutedIconColor?: ColorKey;
  testID?: string;
};

const LocalSpeakingIndicator = ({
  testID,
  activeBackgroundColor = 'white',
  inactiveBackgroundColor,
  mutedBackgroundColor,
  activeIconColor = 'primary.500',
  inactiveIconColor,
  mutedIconColor,
}: LocalSpeakingIndicatorProps) => {
  const { participantsStatus } = useParticipants();
  const { participant } = useSession();

  if (!participant) return null;

  const { isSpeaking, isRemoteAudio } = participantsStatus[participant.id] || {};

  if (!isRemoteAudio) {
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

export default LocalSpeakingIndicator;
