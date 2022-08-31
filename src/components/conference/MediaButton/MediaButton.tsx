/* eslint-disable import/no-extraneous-dependencies */
import type { ColorKey } from '../../../common';
import { useMemo, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { IconComponentName } from '../../ui/Icon/IconComponents';
import IconButton from '../../ui/IconButton/IconButton';
import Space from '../../ui/Space/Space';
import Tooltip from '../../ui/Tooltip/Tooltip';
import type { TooltipProps } from '../../ui/Tooltip/Tooltip';

import styles from './MediaButton.module.scss';

export type MediaButtonProps = {
  activeBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  inactiveBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  disabledBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  activeIconColor?: ColorKey;
  inactiveIconColor?: ColorKey;
  disabledIconColor?: ColorKey;
  activeStrokeColor?: ColorKey;
  inactiveStrokeColor?: ColorKey;
  disabledStrokeColor?: ColorKey;
  activeIcon: IconComponentName;
  inactiveIcon: IconComponentName;
  disabledIcon: IconComponentName;
  activeTooltipText?: string;
  inactiveTooltipText?: string;
  tooltipPosition?: TooltipProps['position'];
  isActive: boolean;
  isDisabled: boolean;
  size?: 's' | 'm' | 'l';
  onClick: () => void;
  testID?: string;
};

const MediaButton = ({
  activeBackgroundColor = 'grey.600',
  inactiveBackgroundColor = 'white',
  disabledBackgroundColor = 'grey.800',
  activeIconColor = 'white',
  inactiveIconColor = 'primary.500',
  disabledIconColor = 'grey.300',
  activeStrokeColor = 'transparent',
  inactiveStrokeColor = 'transparent',
  disabledStrokeColor = 'transparent',
  activeIcon,
  inactiveIcon,
  disabledIcon,
  activeTooltipText = '',
  inactiveTooltipText = '',
  tooltipPosition = 'top',
  isActive,
  isDisabled,
  size = 'm',
  onClick,
  testID,
}: MediaButtonProps) => {
  const [timedDisable, setTimedDisable] = useState(false);

  const { theme, isDesktop } = useTheme();

  const handleOnClick = () => {
    setTimedDisable(true);
    onClick();
    setTimeout(() => {
      setTimedDisable(false);
    }, 1000);
  };

  const tooltipText = useMemo(() => {
    let text;

    if (isDisabled) {
      return '';
    }
    if (isActive) {
      text = activeTooltipText;
    } else {
      text = inactiveTooltipText;
    }

    return text;
  }, [isActive, isDisabled]);

  const iconName = useMemo(() => {
    let icon: IconComponentName;

    if (isDisabled) {
      return disabledIcon;
    }

    if (isActive) {
      icon = activeIcon;
    } else {
      icon = inactiveIcon;
    }

    return icon;
  }, [isActive, isDisabled]);

  const backgroundColor = useMemo(() => {
    let color: ColorKey | [ColorKey, ColorKey];

    if (isDisabled) {
      return disabledBackgroundColor;
    }

    if (isActive) {
      color = activeBackgroundColor;
    } else {
      color = inactiveBackgroundColor;
    }

    return color;
  }, [isActive, isDisabled, theme]);

  const iconColor = useMemo(() => {
    let color: ColorKey;

    if (isDisabled) {
      return disabledIconColor;
    }

    if (isActive) {
      color = activeIconColor;
    } else {
      color = inactiveIconColor;
    }

    return color;
  }, [isActive, isDisabled, theme]);

  const strokeColor: ColorKey = useMemo(() => {
    let color: ColorKey;

    if (isDisabled) {
      return disabledStrokeColor;
    }

    if (isActive) {
      color = activeStrokeColor;
    } else {
      color = inactiveStrokeColor;
    }

    return color;
  }, [isActive, isDisabled, theme]);

  return (
    <Space className={styles.container}>
      <Tooltip position={tooltipPosition} text={isDesktop ? tooltipText : ''}>
        <IconButton
          testID={testID}
          backgroundColor={backgroundColor}
          iconColor={iconColor}
          strokeColor={strokeColor}
          icon={iconName}
          size={size}
          onClick={handleOnClick}
          disabled={isDisabled}
          style={{ opacity: isDisabled ? 0.8 : 1 }}
        />
      </Tooltip>
      {timedDisable && <Space fw fh className={styles.backdrop} />}
    </Space>
  );
};

export default MediaButton;
