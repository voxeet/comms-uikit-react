/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';

import {
  Button,
  useAudio,
  useCamera,
  useConference,
  useMicrophone,
  useSession,
  useTheme,
  useVideo,
  Text,
} from '../../../index';
import { throwErrorMessage } from '../../../utils/throwError.util';
import type { ButtonProps } from '../../ui/Button/Button';

type RejoinConferenceButtonProps = Partial<ButtonProps> & {
  text: string;
  onStart?: (v: boolean) => void;
  onSuccess?: () => void;
  testID?: string;
};

const RejoinConferenceButton = ({ text, onStart, onSuccess, testID, style, ...rest }: RejoinConferenceButtonProps) => {
  const { getColor } = useTheme();
  const { openSession } = useSession();
  const { createConference, joinConference, prevConference } = useConference();
  const { getCameraPermission } = useCamera();
  const { isVideo } = useVideo();
  const { getMicrophonePermission } = useMicrophone();
  const { isAudio } = useAudio();
  const [isCameraPermission, setIsCameraPermission] = useState(false);
  const [isMicrophonePermission, setIsMicrophonePermission] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hasAccess = await getCameraPermission();
        setIsCameraPermission(hasAccess);
      } catch {
        setIsCameraPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const hasAccess = await getMicrophonePermission();
        setIsMicrophonePermission(hasAccess);
      } catch {
        setIsMicrophonePermission(false);
      }
    })();
  }, []);

  const rejoin = async () => {
    if (prevConference) {
      try {
        if (onStart) {
          onStart(true);
        }
        await openSession({
          name: prevConference.participant,
        });

        const conferenceOptions = {
          alias: prevConference.name,
        };
        const conf = await createConference(conferenceOptions);

        const joinOptions = {
          constraints: {
            audio: isAudio && isMicrophonePermission,
            video:
              isVideo && isCameraPermission
                ? {
                    width: {
                      min: '1280',
                      max: '1920',
                    },
                    height: {
                      min: '720',
                      max: '1080',
                    },
                  }
                : false,
          },
        };

        await joinConference(conf, joinOptions);
        if (onStart) {
          onStart(false);
        }
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        throwErrorMessage(error);
      }
    }
  };

  return (
    <Button
      onClick={rejoin}
      variant="tertiary"
      testID={testID}
      style={{
        width: 400,
        height: 56,
        backgroundColor: getColor('black'),
        borderColor: getColor('white'),
        ...style,
      }}
      {...rest}
    >
      <Text type="buttonDefault">{text}</Text>
    </Button>
  );
};

export default RejoinConferenceButton;
