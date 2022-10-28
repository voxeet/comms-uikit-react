/* eslint-disable import/no-extraneous-dependencies */

import cx from 'classnames';
import { useEffect, useState } from 'react';

import type { ColorKey } from '../../../theme/types';
import Icon from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents/index';
import Text from '../Text/Text';

import styles from './InfoBar.module.scss';

export type InfoBarProps = React.HTMLAttributes<HTMLDivElement> & {
  iconName?: IconComponentName;
  iconColor?: ColorKey;
  text: string;
  textColor?: ColorKey;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'error';
  testID?: string;
  duration?: number;
  alwaysVisible?: boolean;
  onInvisible?: () => void;
};

const InfoBar = ({
  iconName = 'info',
  iconColor = 'white',
  text,
  textColor = 'white',
  testID,
  variant = 'default',
  duration = 2000,
  alwaysVisible = false,
  onInvisible,
  ...props
}: InfoBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let visibilityTimeout: ReturnType<typeof setTimeout>;
    setIsVisible(true);
    if (variant !== 'default') return undefined;
    if (!alwaysVisible) {
      visibilityTimeout = setTimeout(() => {
        setIsVisible(false);
        onInvisible?.();
      }, duration);
    } else {
      setIsVisible(true);
    }
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [text]);

  const getIconName = () => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'failure';
      default:
        return iconName || 'info';
    }
  };

  return (
    <div
      data-testid={testID}
      className={cx(
        styles.infoBar,
        variant === 'success' && styles.success,
        variant === 'info' && styles.info,
        variant === 'warning' && styles.warning,
        variant === 'error' && styles.error,
        !isVisible && styles.invisible,
      )}
      {...props}
    >
      <Icon
        name={getIconName()}
        color={iconColor}
        className={variant === 'default' ? styles.defaultLeftIcon : styles.variantsLeftIcon}
      />
      <Text
        color={textColor}
        style={{
          fontWeight: '600',
          letterSpacing: '0.03em',
        }}
        className={variant === 'default' ? styles.defaultText : styles.variantsText}
      >
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

export default InfoBar;
