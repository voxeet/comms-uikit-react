/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import type { ColorKey } from '../../../common';
import cx from 'classnames';
import { useEffect, useState } from 'react';

import Icon from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents/index';
import Text from '../Text/Text';

import styles from './Toast.module.scss';

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  iconName?: IconComponentName;
  iconColor?: ColorKey;
  text: string;
  textColor?: ColorKey;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'error';
  testID?: string;
};

const Toast = ({
  iconName = 'info',
  iconColor = 'white',
  text,
  textColor = 'white',
  testID,
  variant = 'default',
  ...props
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (variant !== 'default') return undefined;
    const duration = 3000;
    const visibilityTimeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [text]);

  const getIconName = () => {
    switch (variant) {
      case 'success':
        return 'successFilled';
      case 'info':
        return 'info';
      case 'warning':
      case 'error':
        return 'warning';
      default:
        return iconName || 'info';
    }
  };

  return (
    <div
      data-testid={testID}
      className={cx(
        styles.toast,
        variant === 'success' && styles.success,
        variant === 'info' && styles.info,
        variant === 'warning' && styles.warning,
        variant === 'error' && styles.error,
        !isVisible && styles.invisible,
      )}
      {...props}
    >
      <Icon name={getIconName()} color={iconColor} className={styles.leftIcon} />
      <Text color={textColor} style={{ minWidth: '230px' }}>
        {text}
      </Text>
      {variant !== 'default' ? (
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            setIsVisible(false);
          }}
        >
          <Icon name="close" color={iconColor} className={styles.actionIcon} />
        </button>
      ) : (
        <div className={styles.action} />
      )}
    </div>
  );
};

export default Toast;
