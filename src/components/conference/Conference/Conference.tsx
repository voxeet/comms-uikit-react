import { useEffect, useState } from 'react';

import { useConference } from '../../../index';

type ConferenceProps = {
  children: React.ReactNode;
  alias: string;
  audio: boolean;
  video: boolean;
};

const Conference = ({ alias, audio, video, children }: ConferenceProps) => {
  const { createConference, joinConference } = useConference();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const conferenceOptions = {
        alias,
      };
      const conf = await createConference(conferenceOptions);

      const joinOptions = {
        constraints: {
          audio,
          video: video
            ? {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
              }
            : false,
        },
      };

      await joinConference(conf, joinOptions);
      setIsReady(true);
    })();
  }, []);

  if (!isReady) return null;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default Conference;
