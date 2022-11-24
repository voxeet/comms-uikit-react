import { useEffect, useRef } from 'react';

import useConference from '../../../hooks/useConference';

type ConferenceProps = {
  children: React.ReactNode;
  id?: string;
  alias?: string;
  audio?: boolean;
  video?: boolean;
  liveRecording?: boolean;
};

const Conference = ({ alias, id, audio = false, video = false, liveRecording = false, children }: ConferenceProps) => {
  const {
    conference: currentConference,
    createConference,
    fetchConference,
    joinConference,
    leaveConference,
  } = useConference();

  const timeout: { current: ReturnType<typeof setTimeout> | null } = useRef(null);

  useEffect(() => {
    timeout.current = setTimeout(async () => {
      let conference;
      if (id) {
        if (currentConference?.id === id) {
          return;
        }
        if (currentConference) await leaveConference();
        conference = await fetchConference(id);
      } else if (alias) {
        if (currentConference?.alias === alias) return;
        if (currentConference) await leaveConference();
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
      timeout.current = null;
    }, 200);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      } else {
        leaveConference();
      }
    };
  }, []);
  if (currentConference?.id !== id && currentConference?.alias !== alias) return null;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default Conference;
