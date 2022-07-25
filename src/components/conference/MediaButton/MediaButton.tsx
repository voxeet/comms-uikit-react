/* eslint-disable import/no-extraneous-dependencies */
import type { IconsKeys, ColorKey } from '../../../common';
import { useMemo, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import IconButton from '../../ui/IconButton/IconButton';
import Tooltip from '../../ui/Tooltip/Tooltip';
import type { TooltipProps } from '../../ui/Tooltip/Tooltip';

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
  activeIcon: IconsKeys;
  inactiveIcon: IconsKeys;
  disabledIcon: IconsKeys;
  activeTooltipText?: string;
  inactiveTooltipText?: string;
  tooltipPosition?: TooltipProps['position'];
  isActive: boolean;
  isDisabled: boolean;
  size?: 's' | 'm';
  onClick: () => void;
  testID?: string;
};

const MediaButton = ({
  activeBackgroundColor = 'grey.800',
  inactiveBackgroundColor = 'white',
  disabledBackgroundColor = 'grey.900',
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

  const { theme } = useTheme();

  const handleOnClick = () => {
    setTimedDisable(true);
    onClick();
    setTimeout(() => {
      setTimedDisable(false);
    }, 1000);
  };

  const tooltipText = useMemo(() => {
    let text;

    if (isDisabled || timedDisable) {
      return '';
    }
    if (isActive) {
      text = activeTooltipText;
    } else {
      text = inactiveTooltipText;
    }

    return text;
  }, [isActive, isDisabled, timedDisable]);

  const iconName = useMemo(() => {
    let icon: IconsKeys;

    if (isDisabled || timedDisable) {
      return disabledIcon;
    }

    if (isActive) {
      icon = activeIcon;
    } else {
      icon = inactiveIcon;
    }

    return icon;
  }, [isActive, isDisabled, timedDisable]);

  const backgroundColor = useMemo(() => {
    let color: ColorKey | [ColorKey, ColorKey];

    if (isDisabled || timedDisable) {
      return disabledBackgroundColor;
    }

    if (isActive) {
      color = activeBackgroundColor;
    } else {
      color = inactiveBackgroundColor;
    }

    return color;
  }, [isActive, isDisabled, timedDisable, theme]);

  const iconColor = useMemo(() => {
    let color: ColorKey;

    if (isDisabled || timedDisable) {
      return disabledIconColor;
    }

    if (isActive) {
      color = activeIconColor;
    } else {
      color = inactiveIconColor;
    }

    return color;
  }, [isActive, isDisabled, timedDisable, theme]);

  const strokeColor: ColorKey = useMemo(() => {
    let color: ColorKey;

    if (isDisabled || timedDisable) {
      return disabledStrokeColor;
    }

    if (isActive) {
      color = activeStrokeColor;
    } else {
      color = inactiveStrokeColor;
    }

    return color;
  }, [isActive, isDisabled, timedDisable, theme]);

  return (
    <Tooltip position={tooltipPosition} text={tooltipText}>
      <IconButton
        testID={testID}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        strokeColor={strokeColor}
        icon={iconName}
        size={size}
        onClick={handleOnClick}
        disabled={isDisabled || timedDisable}
        style={{ opacity: isDisabled ? 0.8 : 1 }}
      />
    </Tooltip>
  );
};

export default MediaButton;
