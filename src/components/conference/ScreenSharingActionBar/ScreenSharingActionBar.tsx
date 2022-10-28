import { useCallback, useMemo } from 'react';

import { Status as ShareStatus } from '../../../hooks/types/misc';
import useParticipants from '../../../hooks/useParticipants';
import useScreenSharing from '../../../hooks/useScreenSharing';
import useTheme from '../../../hooks/useTheme';
import ActionBar, { type AbstractionBarPropsBase, type ActionButtonLabels } from '../../ui/ActionBar/ActionBar';
import Avatar from '../../ui/Avatar/Avatar';
import Status from '../../ui/Status/Status';
import Text from '../../ui/Text/Text';

type ScreenSharingActionBarProps = AbstractionBarPropsBase<ActionButtonLabels, typeof statusColors>;

const statusColors = {
  [ShareStatus.Active]: 'infoSuccess',
  [ShareStatus.Loading]: 'transparent',
  [ShareStatus.Error]: 'infoWarning',
  [ShareStatus.Other]: 'transparent',
};

const ScreenSharingActionBar = ({
  buttonLabels,
  statusLabels,
  guestLabel,
  onActionSuccess,
  compact = false,
  testID,
  ...props
}: ScreenSharingActionBarProps) => {
  const { isDesktop } = useTheme();
  const { stopScreenShare, status, owner } = useScreenSharing();
  const { participant } = useParticipants();

  const stopPresenting = useCallback(async () => {
    await stopScreenShare();
    onActionSuccess?.();
  }, []);

  const isLocalPresenter = participant?.id === owner?.id;

  const avatar = useMemo(() => !isLocalPresenter && <Avatar size="xs" participant={owner} />, [owner]);

  if (!isLocalPresenter && status !== ShareStatus.Active) return null;
  return (
    <ActionBar
      compact={compact}
      testID={testID}
      actionButtonConfig={
        isLocalPresenter && status !== ShareStatus.Error && isDesktop && !compact
          ? { callback: stopPresenting, ...buttonLabels }
          : undefined
      }
      {...props}
    >
      {isDesktop ? (
        <Status
          statusDotColor={isLocalPresenter ? statusColors[status] : undefined}
          icon="present"
          avatar={avatar}
          label={isLocalPresenter ? statusLabels[status] : guestLabel}
        />
      ) : (
        <Text>{guestLabel}</Text>
      )}
    </ActionBar>
  );
};

export default ScreenSharingActionBar;
