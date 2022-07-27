import { useEffect, useState } from 'react';

import { useConference } from '../../../index';

type ConferenceProps = {
  children: React.ReactNode;
  id?: string;
  alias?: string;
  audio?: boolean;
  video?: boolean;
  liveRecording?: boolean;
};

const Conference = ({ alias, id, audio = false, video = false, liveRecording = false, children }: ConferenceProps) => {
  const { createConference, fetchConference, joinConference } = useConference();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let conference;
      if (id) {
        conference = await fetchConference(id);
      } else if (alias) {
        const createOptions = {
          alias,
          params: {
            liveRecording,
          },
        };
        conference = await createConference(createOptions);
      } else {
        return;
      }

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

      await joinConference(conference, joinOptions);
      setIsReady(true);
    })();
  }, []);

  if (!isReady) return null;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default Conference;
