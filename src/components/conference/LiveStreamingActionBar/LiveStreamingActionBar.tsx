import { useMemo, type ReactNode } from 'react';

import { Status as StreamingStatus } from '../../../hooks/types/misc';
import useLiveStreaming from '../../../hooks/useLiveStreaming';
import useTheme from '../../../hooks/useTheme';
import ActionBar, { type AbstractionBarPropsBase, type ActionButtonLabels } from '../../ui/ActionBar/ActionBar';
import Status from '../../ui/Status/Status';

type ButtonLabels = Record<'active' | 'error', ActionButtonLabels>;
type LiveStreamingActionBarProps = AbstractionBarPropsBase<ButtonLabels, typeof statusColors> & {
  streamingServiceLogo?: ReactNode;
  actions: Record<'start' | 'stop', () => Promise<boolean> | void>;
};

const statusColors = {
  [StreamingStatus.Active]: 'infoError',
  [StreamingStatus.Loading]: 'transparent',
  [StreamingStatus.Error]: 'infoWarning',
  [StreamingStatus.Other]: 'transparent',
};

const LiveStreamingActionBar = ({
  buttonLabels,
  statusLabels,
  onActionSuccess,
  compact = false,
  streamingServiceLogo,
  guestLabel,
  testID,
  actions,
  ...props
}: LiveStreamingActionBarProps) => {
  const { status, isLocalUserLiveStreamingOwner, resetLiveStreamingData } = useLiveStreaming();
  const { isDesktop, isTablet } = useTheme();

  const stopStreamingHandler = async () => {
    const result = await actions.stop();
    if (result) {
      onActionSuccess?.();
    }
  };

  const startStreamingHandler = async () => {
    actions.start();
  };

  const callbacks = useMemo(
    () => ({
      [StreamingStatus.Active]: stopStreamingHandler,
      [StreamingStatus.Error]: startStreamingHandler,
    }),
    [status],
  );

  const onErrorClose = async () => {
    await resetLiveStreamingData();
  };

  if (!isLocalUserLiveStreamingOwner && status !== StreamingStatus.Active) return null;
  if (isLocalUserLiveStreamingOwner && status === StreamingStatus.Other) return null;

  return (
    <ActionBar
      unified
      compact={compact}
      testID={testID}
      actionButtonConfig={
        isLocalUserLiveStreamingOwner &&
        (status === StreamingStatus.Active || status === StreamingStatus.Error) &&
        !compact
          ? { callback: callbacks[status], ...buttonLabels[status] }
          : undefined
      }
      closeCallback={status === StreamingStatus.Error ? onErrorClose : undefined}
      {...props}
    >
      <Status
        streamingServiceLogo={isDesktop || isTablet ? streamingServiceLogo : undefined}
        statusDotColor={statusColors[status]}
        icon="stream"
        label={isLocalUserLiveStreamingOwner ? statusLabels[status] : guestLabel}
        compact={!isDesktop && compact}
      />
    </ActionBar>
  );
};

export default LiveStreamingActionBar;
