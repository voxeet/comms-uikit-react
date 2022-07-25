import type { ColorKey } from '../../../common';

import useParticipants from '../../../hooks/useParticipants';
import useSession from '../../../hooks/useSession';
import IconIndicator from '../../ui/indicators/IconIndicator/IconIndicator';
import SpeakingIndicator from '../../ui/indicators/SpeakingIndicator/SpeakingIndicator';

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
      <SpeakingIndicator
        testID={`${testID}-speaking`}
        backgroundColor={activeBackgroundColor}
        iconColor={activeIconColor}
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
