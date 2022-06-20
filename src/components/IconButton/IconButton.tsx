/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey, IconsKeys, Sizes } from '../../common';
import cx from 'classnames';
import Color from 'color';
import { useState, useMemo, ButtonHTMLAttributes } from 'react';

import useTheme from '../../hooks/useTheme';
import Badge from '../Badge/Badge';
import Icon, { ColorTone } from '../Icon/Icon';

import styles from './IconButton.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'square' | 'rectangular' | 'circle';
  backgroundColor?: ColorKey | [ColorKey, ColorKey];
  iconColor?: ColorKey;
  badge?: boolean;
  badgeColor?: ColorKey;
  badgeContentColor?: ColorKey;
  strokeColor?: ColorKey;
  size?: Extract<Sizes, 'xxs' | 'xs' | 's' | 'm'>;
  disabled?: boolean;
  icon: IconsKeys;
  onClick: () => void;
  testID?: string;
  style?: React.CSSProperties;
}

const IconButton = ({
  variant = 'square',
  backgroundColor,
  iconColor,
  badge = false,
  badgeColor,
  badgeContentColor,
  strokeColor,
  size = 'm',
  disabled = false,
  icon,
  onClick,
  testID,
  style,
  ...props
}: IconButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getColorOrGradient, getColor } = useTheme();

  const isGradient = useMemo(() => {
    return Array.isArray(backgroundColor);
  }, [backgroundColor]);

  const handleIconColorTone = useMemo(() => {
    let colorTone: ColorTone = 'default';

    if (isHovered) colorTone = 'light';
    else return colorTone;

    return colorTone;
  }, [iconColor, disabled, isHovered]);

  const handleBackgroundColor = useMemo(() => {
    let color = getColorOrGradient(backgroundColor, 'grey.800');

    if (!isGradient && backgroundColor !== 'transparent') {
      if (backgroundColor) color = getColor(backgroundColor as string);
      if (isHovered) color = Color(color).lighten(0.2).hex();
      else color = getColor(backgroundColor as string, 'grey.800');
    }
    // GRADIENT
    if (isGradient && backgroundColor) {
      if (isHovered)
        color = `linear-gradient(99.69deg, ${Color(color[0]).lighten(0.2).hex()} -10.66%, ${Color(color[1])
          .lighten(0.2)
          .hex()} 114.64%)`;
      else color = `linear-gradient(99.69deg, ${color[0]} -10.66%, ${color[1]} 114.64%)`;
    }

    return color as string;
  }, [backgroundColor, disabled, isHovered]);

  const handleBadgeContent = useMemo(() => {
    let content;

    if (typeof badge !== 'boolean') {
      content = badge;
    }

    return content;
  }, [badge]);

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      type="button"
      data-testid={testID}
      className={cx(
        styles.iconBtn,
        variant === 'rectangular' && styles.rectangular,
        variant === 'circle' && styles.circle,
        variant !== 'rectangular' && styles[`size-${size}`],
        isHovered && !disabled && styles.hovered,
        disabled && styles.disabled,
      )}
      style={{
        background: handleBackgroundColor,
        border: `1px solid ${strokeColor ? getColor(strokeColor) : 'transparent'}`,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {badge && (
        <div className={styles.badgeContainer}>
          <Badge
            testID="IconButtonBadge"
            content={handleBadgeContent}
            backgroundColor={badgeColor}
            contentColor={badgeContentColor}
          />
        </div>
      )}
      {icon && (
        <Icon testID="IconButtonIcon" name={icon} color={iconColor} colorTone={handleIconColorTone} size={size} />
      )}
    </button>
  );
};

export default IconButton;
