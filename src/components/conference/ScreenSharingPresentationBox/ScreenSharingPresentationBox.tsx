/* eslint-disable react/jsx-props-no-spreading */

import { Status as ShareStatus } from '../../../hooks/types/misc';
import useScreenSharing from '../../../hooks/useScreenSharing';
import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Avatar from '../../ui/Avatar/Avatar';
import PresentationBox, { PresentationBoxProps } from '../../ui/PresentationBox/PresentationBox';
import Text from '../../ui/Text/Text';

import DefaultFallback from './DefaultFallback/DefaultFallback';

type ScreenSharingPresentationBoxProps = Partial<
  Omit<PresentationBoxProps, 'stream' | 'errorMessages' | 'fallbackContent'>
> & {
  labelBuilder?: (name: string) => string;
  customFallbackContent?: React.ReactNode;
  fallbackText: string;
  fallbackButtonText?: string;
  backgroundColor?: ColorKey;
};

const ScreenSharingPresentationBox = ({
  labelBuilder,
  customFallbackContent,
  fallbackText,
  fallbackButtonText,
  backgroundColor = 'grey.700',
  testID = 'ScreenSharingPresentationBox',
  style,
  ...rest
}: ScreenSharingPresentationBoxProps) => {
  const { owners, status, isLocalUserPresentationOwner, isPendingTakeoverRequest, sharingInProgressError } =
    useScreenSharing();

  const { getColor } = useTheme();

  return (
    <>
      {Array.from(owners).map(([participant, stream]) => (
        <PresentationBox
          key={stream?.id}
          stream={stream}
          isError={
            status === ShareStatus.Error &&
            isLocalUserPresentationOwner &&
            !isPendingTakeoverRequest &&
            !sharingInProgressError
          }
          isLocalUserPresentationOwner={isLocalUserPresentationOwner}
          backgroundColor={backgroundColor}
          fallbackContent={
            customFallbackContent || <DefaultFallback messageText={fallbackText} buttonText={fallbackButtonText} />
          }
          style={{ borderRadius: 8, ...style }}
          testID={testID}
          {...rest}
        >
          <>
            <Avatar testID="Avatar" size="xs" participant={participant} />
            {labelBuilder && participant.info.name && (
              <Text testID="Presenter" color={getColor('white')} type="captionDemiBold">
                {labelBuilder(participant.info.name)}
              </Text>
            )}
          </>
        </PresentationBox>
      ))}
      ;
    </>
  );
};

export default ScreenSharingPresentationBox;
