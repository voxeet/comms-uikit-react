import type { JoinOptions } from '@voxeet/voxeet-web-sdk/types/models/Options';

import { Button, useConference, Text } from '../../../index';
import { throwErrorMessage } from '../../../utils/throwError.util';
import type { ButtonProps } from '../../ui/Button/Button';

type RejoinConferenceButtonProps = Partial<ButtonProps> & {
  text: string;
  onStart?: (v: boolean) => void;
  onSuccess?: () => void;
  testID?: string;
  joinOptions: JoinOptions;
};

const RejoinConferenceButton = ({
  text,
  onStart,
  onSuccess,
  testID,
  style,
  className,
  joinOptions,
  ...rest
}: RejoinConferenceButtonProps) => {
  const { createConference, fetchConference, joinConference, prevConference } = useConference();

  const rejoin = async () => {
    if (prevConference) {
      try {
        if (onStart) {
          onStart(true);
        }

        try {
          const conf = await fetchConference(prevConference.id);
          await joinConference(conf, joinOptions);
        } catch (error) {
          const conf = await createConference({ alias: prevConference.name });
          await joinConference(conf, joinOptions);
        }

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
