/* eslint-disable react/jsx-props-no-spreading */

import { Status as ShareStatus } from '../../../hooks/types/misc';
import useScreenSharing from '../../../hooks/useScreenSharing';
import type { ColorKey } from '../../../theme/types';
import PresentationBox, { PresentationBoxProps } from '../../ui/PresentationBox/PresentationBox';

import DefaultFallback from './DefaultFallback/DefaultFallback';

type ScreenSharingPresentationBoxProps = Partial<
  Omit<PresentationBoxProps, 'stream' | 'errorMessages' | 'fallbackContent'>
> & {
  customFallbackContent?: React.ReactNode;
  fallbackText: string;
  fallbackButtonText?: string;
  backgroundColor?: ColorKey;
};

const ScreenSharingPresentationBox = ({
  customFallbackContent,
  fallbackText,
  fallbackButtonText,
  backgroundColor = 'grey.700',
  testID = 'ScreenSharingPresentationBox',
  style,
  ...rest
}: ScreenSharingPresentationBoxProps) => {
  const { stream, status, isLocalUserPresentationOwner, isPendingTakeoverRequest, sharingInProgressError } =
    useScreenSharing();

  return (
    <PresentationBox
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
    />
  );
};

export default ScreenSharingPresentationBox;
