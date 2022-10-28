import cx from 'classnames';
import Color from 'color';
import { useState, useMemo, ButtonHTMLAttributes } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey, Sizes } from '../../../theme/types';
import Badge from '../Badge/Badge';
import Icon, { ColorTone } from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents';
import Space from '../Space/Space';

import styles from './IconButton.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'square' | 'rectangular' | 'circle';
  backgroundColor?: ColorKey | [ColorKey, ColorKey];
  iconColor?: ColorKey;
  badge?: string | number | boolean;
  badgeColor?: ColorKey;
  badgeContentColor?: ColorKey;
  badgeHoverContent?: string;
  rightBadge?: boolean;
  strokeColor?: ColorKey;
  size?: Extract<Sizes, 'xxs' | 'xs' | 's' | 'm' | 'l'>;
  disabled?: boolean;
  icon: IconComponentName;
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
  badgeHoverContent,
  rightBadge,
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
  const [isTouched, setIsTouched] = useState(false);
  const { getColorOrGradient, getColor, theme, isDesktop } = useTheme();

  const isGradient = useMemo(() => {
    return Array.isArray(backgroundColor);
  }, [backgroundColor]);

  const handleIconColorTone = useMemo(() => {
    let colorTone: ColorTone = 'default';

    if ((isHovered && !disabled && isDesktop) || (isTouched && !disabled && !isDesktop)) colorTone = 'light';
    else return colorTone;

    return colorTone;
  }, [iconColor, disabled, isHovered, theme, isDesktop, isTouched]);

  const handleBackgroundColor = useMemo(() => {
    let color = getColorOrGradient(backgroundColor, 'grey.800');

    if (!isGradient && backgroundColor !== 'transparent') {
      if (backgroundColor) color = getColor(backgroundColor as string);
      if ((isHovered && !disabled && isDesktop) || (isTouched && !disabled && !isDesktop))
        color = Color(color).lighten(0.2).hex();
      else color = getColor(backgroundColor as string, 'grey.800');
    }

    if (
      (backgroundColor === 'transparent' && isHovered && isDesktop) ||
      (backgroundColor === 'transparent' && isTouched && !isDesktop)
    ) {
      color = getColor('grey.500');
    }

    // GRADIENT
    if (isGradient && backgroundColor) {
      if ((isHovered && !disabled && isDesktop) || (isTouched && !disabled && !isDesktop))
        color = `linear-gradient(99.69deg, ${Color(color[0]).lighten(0.2).hex()} -10.66%, ${Color(color[1])
          .lighten(0.2)
          .hex()} 114.64%)`;
      else color = `linear-gradient(99.69deg, ${color[0]} -10.66%, ${color[1]} 114.64%)`;
    }

    return color as string;
  }, [backgroundColor, disabled, isHovered, theme, isDesktop, isTouched]);

  const handleBadgeContent = useMemo(() => {
    let content;

    if (typeof badge !== 'boolean') {
      content = badge;
    }

    if (isHovered && badgeHoverContent && isDesktop) {
      content = badgeHoverContent;
    }

    return content;
  }, [badge, badgeHoverContent, isHovered, isDesktop]);

  const handleBadgePosition = useMemo(() => {
    if ((isHovered && isDesktop) || (backgroundColor !== 'transparent' && !isHovered)) {
      return styles.IconHasBackground;
    }

    return styles.IconHasNoBackground;
  }, [backgroundColor, isHovered, isDesktop]);

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
        borderRadius: variant === 'circle' ? '100%' : `${theme.borderRadius}px`,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
      disabled={disabled}
      {...props}
    >
      {(badge || (badgeHoverContent && isHovered)) && (
        <Space
          className={cx(
            styles.badgeContainer,
            !isDesktop && styles.mobile,
            handleBadgeContent ? styles.withContent : styles.withDot,
            handleBadgePosition,
            rightBadge && !isDesktop && styles.rightBadge,
            rightBadge && !isHovered && isDesktop && styles.rightBadge,
          )}
        >
          <Badge
            testID="IconButtonBadge"
            content={handleBadgeContent}
            backgroundColor={badgeColor}
            contentColor={badgeContentColor}
          />
        </Space>
      )}
      {icon && (
        <Icon
          style={{ pointerEvents: 'none' }}
          testID="IconButtonIcon"
          name={icon}
          color={iconColor}
          colorTone={handleIconColorTone}
          size={size}
        />
      )}
    </button>
  );
};

export default IconButton;
