import type { ParticipantInfo } from '@voxeet/voxeet-web-sdk/types/models/Options';
import { useEffect, useState } from 'react';

import { useSession } from '../../../index';

type SessionProps = {
  children: React.ReactNode;
  participantInfo: ParticipantInfo;
};

const Session = ({ participantInfo, children }: SessionProps) => {
  const { openSession } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    openSession(participantInfo).then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) return null;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default Session;
