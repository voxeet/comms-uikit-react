import type { Participant } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import React, { useEffect } from 'react';

import useParticipants from '../../../hooks/useParticipants';

type ParticipantsGridItemProps = {
  participant: Participant;
};

const HiddenVideoTile = React.memo(({ participant }: ParticipantsGridItemProps) => {
  const { addIsSpeakingListener } = useParticipants();

  useEffect(() => {
    return addIsSpeakingListener(participant);
  }, []);

  return null;
});

export default HiddenVideoTile;
