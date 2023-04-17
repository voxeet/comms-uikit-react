import { useMemo } from 'react';

import { Status as RecordingStatus } from '../../../hooks/types/misc';
import useRecording from '../../../hooks/useRecording';
import useTheme from '../../../hooks/useTheme';
import ActionBar, { type AbstractionBarPropsBase, type ActionButtonLabels } from '../../ui/ActionBar/ActionBar';
import Status from '../../ui/Status/Status';

type ButtonLabels = Record<'active' | 'error', ActionButtonLabels>;
type RecordingActionBarProps = AbstractionBarPropsBase<ButtonLabels, typeof statusColors>;

const statusColors = {
  [RecordingStatus.Active]: 'infoError',
  [RecordingStatus.Loading]: 'transparent',
  [RecordingStatus.Error]: 'infoWarning',
  [RecordingStatus.Other]: 'transparent',
};

const RecordingActionBar = ({
  buttonLabels,
  statusLabels,
  onActionSuccess,
  compact = false,
  guestLabel,
  testID,
  ...props
}: RecordingActionBarProps) => {
  const { isDesktop } = useTheme();
  const { stopRecording, isLocalUserRecordingOwner, status, startRecording, resetRecordingData, setRecordingErrors } =
    useRecording();

  const callbacks = useMemo(
    () => ({
      [RecordingStatus.Active]: async () => {
        const result = await stopRecording();
        if (result) {
          onActionSuccess?.();
        }
      },
      [RecordingStatus.Error]: async () => {
        const result = await startRecording();
        if (result) {
          onActionSuccess?.();
        }
      },
    }),
    [],
  );

  const onErrorClose = async () => {
    const result = await stopRecording();
    if (!result) {
      resetRecordingData();
      setRecordingErrors();
    }
  };

  if (!isLocalUserRecordingOwner && status !== RecordingStatus.Active) return null;
  if (isLocalUserRecordingOwner && status === RecordingStatus.Other) return null;

  return (
    <ActionBar
      unified
      compact={compact}
      testID={testID}
      actionButtonConfig={
        isLocalUserRecordingOwner && (status === RecordingStatus.Active || status === RecordingStatus.Error) && !compact
          ? { callback: callbacks[status], ...buttonLabels[status] }
          : undefined
      }
      closeCallback={status === RecordingStatus.Error ? onErrorClose : undefined}
      {...props}
    >
      <Status
        statusDotColor={statusColors[status]}
        icon="record"
        label={isLocalUserRecordingOwner || !guestLabel ? statusLabels[status] : guestLabel}
        compact={!isDesktop && compact}
      />
    </ActionBar>
  );
};

export default RecordingActionBar;
