import type { IconsKeys, ColorKey } from '@uikit/common';
import Color from 'color';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useTheme from '../../hooks/useTheme';
import Icon, { ColorTone } from '../Icon/Icon';

import styles from './SquareButton.style';

type SquareButtonProps = {
  type?: 'square' | 'rectangular';
  backgroundColor?: ColorKey | [ColorKey, ColorKey];
  iconColor?: ColorKey;
  disabled?: boolean;
  icon: IconsKeys;
  onPress: () => void;
  testID?: string;
};

const SquareButton = ({
  type = 'square',
  backgroundColor,
  iconColor,
  disabled = false,
  icon,
  onPress,
  testID,
}: SquareButtonProps) => {
  const { colors, getColorOrGradient, getColor } = useTheme();

  const isGradient = useMemo(() => {
    return Array.isArray(backgroundColor);
  }, [backgroundColor]);

  const handleIconColorTone = useMemo(() => {
    let colorTone = 'default';

    // if (iconColor === 'gradient') color = 'gradient';
    // if (iconColor !== 'gradient' && disabled) color = Color(color).darken(0.5).hex();
    if (disabled) colorTone = 'dark';

    return colorTone as ColorTone;
  }, [iconColor, disabled]);

  // not includes gradients
  const handleBackgroundColor = useMemo(() => {
    let color = getColor(backgroundColor as string, colors.grey[800]);

    if (!isGradient) color = getColor(backgroundColor as string, colors.grey[800]);
    if (!isGradient && disabled) color = Color(color).darken(0.5).hex();

    return color;
  }, [backgroundColor, disabled]);

  const getContent = useMemo(() => {
    const color = getColorOrGradient(backgroundColor);

    let activeContent = <Icon testID="Icon" name={icon} color={iconColor} colorTone={handleIconColorTone} />;

    if (isGradient && backgroundColor) {
      activeContent = (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={
            disabled ? [Color(color[0]).darken(0.5).hex(), Color(color[1]).darken(0.5).hex()] : [color[0], color[1]]
          }
          style={styles.linearGradient}
        >
          <Icon testID="Icon" name={icon} color={iconColor} colorTone={handleIconColorTone} />
        </LinearGradient>
      );
    }

    return activeContent;
  }, [icon, iconColor, disabled]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={[
        styles.squareBtn,
        type === 'rectangular' && styles.rectangular,
        { backgroundColor: handleBackgroundColor },
      ]}
    >
      {getContent}
    </TouchableOpacity>
  );
};

export default SquareButton;
