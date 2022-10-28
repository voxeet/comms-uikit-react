import { Button, useAudio, useCamera, useConference, useMicrophone, useSession, useVideo, Text } from '../../../index';
import { throwErrorMessage } from '../../../utils/throwError.util';
import type { ButtonProps } from '../../ui/Button/Button';

type RejoinConferenceButtonProps = Partial<ButtonProps> & {
  text: string;
  onStart?: (v: boolean) => void;
  onSuccess?: () => void;
  testID?: string;
};

const RejoinConferenceButton = ({
  text,
  onStart,
  onSuccess,
  testID,
  style,
  className,
  ...rest
}: RejoinConferenceButtonProps) => {
  const { openSession } = useSession();
  const { createConference, joinConference, prevConference } = useConference();
  const { getCameraPermission } = useCamera();
  const { isVideo } = useVideo();
  const { getMicrophonePermission } = useMicrophone();
  const { isAudio } = useAudio();

  const rejoin = async () => {
    if (prevConference) {
      try {
        if (onStart) {
          onStart(true);
        }
        const isCameraPermission = await getCameraPermission();
        const isMicrophonePermission = await getMicrophonePermission();
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
      variant="secondary"
      testID={testID}
      style={{
        ...style,
      }}
      className={className}
      {...rest}
    >
      <Text type="button">{text}</Text>
    </Button>
  );
};

export default RejoinConferenceButton;
