import cx from 'classnames';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';

import {
  NotificationVariants,
  Notification as NotificationType,
  NotificationConfigBase,
} from '../../../hooks/types/Notifications';
import useNotification from '../../../hooks/useNotifications';
import useTheme from '../../../hooks/useTheme';
import type { Sizes } from '../../../theme/types';
import Icon from '../../ui/Icon/Icon';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';
import type { NotificationPositions } from '../NotificationCenter/NotificationCenter';
import styles from '../NotificationCenter/NotificationCenter.module.scss';

export type NotificationSizes = Extract<Sizes, 's' | 'm'>;

type NotificationProps = Omit<NotificationType, 'id'> & {
  notificationId?: number;
  duration?: number;
  position?: NotificationPositions;
  size?: NotificationSizes;
  width?: number;
  testID?: string;
} & ComponentProps<typeof Space>;

export type NotificationConfig = Record<NotificationVariants, NotificationConfigBase>;

export const defaultNotificationConfig = {
  [NotificationVariants.Info]: { bgColor: 'infoInformation', icon: 'info' },
  [NotificationVariants.Success]: { bgColor: 'success.600', icon: 'success' },
  [NotificationVariants.Warning]: { bgColor: 'infoWarning', icon: 'warning', color: 'black' },
  [NotificationVariants.Error]: { bgColor: 'infoError', icon: 'warning' },
  [NotificationVariants.Neutral]: { bgColor: 'grey.800' },
} as NotificationConfig;

const Notification = ({
  notificationId,
  message,
  variant,
  callback,
  position = 'top-right',
  duration,
  width,
  instanceConfig,
  size = 'm',
  ...props
}: NotificationProps) => {
  const { getColor, isMobile, isDesktop, isTablet } = useTheme();
  const { removeNotification } = useNotification();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const actualDuration = instanceConfig?.duration || duration;
    if (actualDuration) {
      setTimeout(() => fadeOut(), actualDuration);
    }
  }, []);

  const fadeOut = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      removeNotificationHandler();
    }, 600);
  };

  const removeNotificationHandler = () => {
    callback?.();
    if (notificationId) {
      removeNotification(notificationId);
    }
  };
  // We can extend this to accept custom config passed from NotificationContainer
  const config = defaultNotificationConfig[variant];
  const color = useMemo(() => getColor(config.color, 'white'), []);

  const isCloseButton = useMemo(() => {
    const closeType = typeof instanceConfig?.close;

    if (closeType === 'boolean' && instanceConfig?.close === false) {
      return false;
    }
    return true;
  }, [instanceConfig]);

  return (
    <Space
      mb="s"
      key={notificationId}
      style={{
        backgroundColor: getColor(instanceConfig?.bgColor || config.bgColor),
        width:
          instanceConfig?.width ||
          // eslint-disable-next-line no-nested-ternary
          (size === 's' ? 240 : width || (isDesktop ? 400 : isTablet ? 375 : isMobile ? 320 : 300)),
      }}
      className={cx(styles.notification, styles.toast, styles[isMobile ? 'top-center' : position], {
        [styles.fadeOut]: isFadingOut,
        [styles.small]: size === 's',
      })}
      testID="Notification"
      {...props}
    >
      <Space className={styles.notificationLeftElement}>
        <Icon
          testID={`${instanceConfig?.icon || config.icon}-icon`}
          name={instanceConfig?.icon || config.icon || 'info'}
          color={color}
          size={size === 's' ? 'xs' : size}
        />
        <Space
          tag="span"
          className={cx(styles.notificationMessage, { [styles.singleLine]: instanceConfig?.singleLine })}
          ml="xs"
          style={{ color }}
        >
          <Text color={color} type="captionSmallDemiBold">
            {message}
          </Text>
        </Space>
      </Space>
      {isCloseButton && (
        <Space p={size === 's' ? 'xxs' : 'xs'} className={styles.closeElement} onClick={fadeOut}>
          <Icon size="xxs" name="close" color={color} testID="remove-button" />
        </Space>
      )}
    </Space>
  );
};

export default React.memo(Notification);
