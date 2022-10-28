import cx from 'classnames';
import type { ComponentProps } from 'react';

import useNotifications from '../../../hooks/useNotifications';
import useTheme from '../../../hooks/useTheme';
import type Space from '../../ui/Space/Space';
import type { NotificationSizes } from '../Notification/Notification';
import Notification from '../Notification/Notification';

import styles from './NotificationCenter.module.scss';

export type NotificationPositions =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NotificationCenterProps = {
  position?: NotificationPositions;
  additionalNotificationContainerProps?: ComponentProps<typeof Space>;
  duration?: number;
  notificationWidth?: number;
  notificationSize?: NotificationSizes;
  testID?: string;
};

const NotificationCenter = ({
  position = 'top-center',
  duration = 4000,
  additionalNotificationContainerProps,
  notificationWidth,
  testID,
  notificationSize,
  ...props
}: NotificationCenterProps) => {
  const { notifications, shouldShowNotificationCenter } = useNotifications();
  const { isMobile } = useTheme();

  return shouldShowNotificationCenter ? (
    <div
      data-testid={testID}
      className={cx(styles.notificationCenter, styles[isMobile ? 'top-center' : position])}
      {...props}
    >
      {notifications.map(({ id, ...rest }) => (
        <Notification
          key={id}
          position={isMobile ? 'top-center' : position}
          duration={duration}
          width={notificationWidth}
          notificationId={id}
          size={notificationSize}
          {...rest}
          {...additionalNotificationContainerProps}
        />
      ))}
    </div>
  ) : null;
};

export default NotificationCenter;
