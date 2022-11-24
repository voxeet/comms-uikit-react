/* eslint-disable import/no-extraneous-dependencies */
import { useMemo, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import type { IconComponentName } from '../../ui/Icon/IconComponents';
import IconButton from '../../ui/IconButton/IconButton';
import Space from '../../ui/Space/Space';
import Tooltip from '../../ui/Tooltip/Tooltip';
import type { TooltipProps } from '../../ui/Tooltip/Tooltip';

import styles from './MediaButton.module.scss';

export type MediaButtonProps = {
  transparent?: boolean;
  defaultBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  activeBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  disabledBackgroundColor?: ColorKey | [ColorKey, ColorKey];
  defaultIconColor?: ColorKey;
  activeIconColor?: ColorKey;
  disabledIconColor?: ColorKey;
  defaultStrokeColor?: ColorKey;
  activeStrokeColor?: ColorKey;
  disabledStrokeColor?: ColorKey;
  defaultIcon: IconComponentName;
  activeIcon: IconComponentName;
  disabledIcon: IconComponentName;
  defaultTooltipText?: string;
  activeTooltipText?: string;
  tooltipPosition?: TooltipProps['position'];
  badge?: string | number | boolean;
  badgeColor?: ColorKey;
  isActive: boolean;
  isDisabled?: boolean;
  size?: 's' | 'm' | 'l';
  onClick: () => void;
  testID?: string;
  style?: React.CSSProperties;
};

const MediaButton = ({
  transparent = false,
  defaultBackgroundColor = 'grey.600',
  activeBackgroundColor = 'white',
  disabledBackgroundColor = 'grey.800',
  defaultIconColor = 'white',
  activeIconColor = 'primary.500',
  disabledIconColor = 'grey.300',
  defaultStrokeColor = 'transparent',
  activeStrokeColor = 'transparent',
  disabledStrokeColor = 'transparent',
  defaultIcon,
  activeIcon,
  disabledIcon,
  defaultTooltipText = '',
  activeTooltipText = '',
  tooltipPosition = 'top',
  badge = false,
  badgeColor = 'primary.500',
  isActive,
  isDisabled = false,
  size = 'm',
  onClick,
  testID,
  style,
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
    if (isDisabled) {
      return '';
    }
    if (isActive) {
      return activeTooltipText;
    }
    return defaultTooltipText;
  }, [isActive, isDisabled]);

  const iconName: IconComponentName = useMemo(() => {
    if (isDisabled) {
      return disabledIcon;
    }
    if (isActive) {
      return activeIcon;
    }
    return defaultIcon;
  }, [isActive, isDisabled]);

  const backgroundColor: ColorKey | [ColorKey, ColorKey] = useMemo(() => {
    if (isDisabled) {
      return disabledBackgroundColor;
    }
    if (isActive) {
      return activeBackgroundColor;
    }
    return defaultBackgroundColor;
  }, [isActive, isDisabled, theme]);

  const iconColor: ColorKey = useMemo(() => {
    if (isDisabled) {
      return disabledIconColor;
    }

    if (isActive) {
      return activeIconColor;
    }
    return defaultIconColor;
  }, [isActive, isDisabled, theme]);

  const strokeColor: ColorKey = useMemo(() => {
    if (isDisabled) {
      return disabledStrokeColor;
    }

    if (isActive) {
      return activeStrokeColor;
    }
    return defaultStrokeColor;
  }, [isActive, isDisabled, theme]);

  return (
    <Space className={styles.container}>
      <Tooltip position={tooltipPosition} text={isDesktop ? tooltipText : ''}>
        <IconButton
          testID={testID}
          backgroundColor={transparent ? 'transparent' : backgroundColor}
          iconColor={iconColor}
          strokeColor={strokeColor}
          icon={iconName}
          size={size}
          onClick={handleOnClick}
          disabled={isDisabled}
          badge={badge}
          badgeColor={badgeColor}
          style={{ opacity: isDisabled ? 0.8 : 1, ...style }}
        />
      </Tooltip>
      {timedDisable && <Space fw fh className={styles.backdrop} />}
    </Space>
  );
};

export default MediaButton;
