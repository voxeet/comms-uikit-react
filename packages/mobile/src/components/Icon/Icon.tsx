import { Icons, ColorKey } from '@uikit/common';
import type { IconsKeys } from '@uikit/common';
import Color from 'color';
import React, { useMemo } from 'react';

import useTheme from '../../hooks/useTheme';

export type ColorTone = 'light' | 'default' | 'dark';

export type IconProps = {
  name: IconsKeys;
  // TODO add gradient - [string, string]
  color?: ColorKey;
  colorTone?: ColorTone;
  size?: 'xsmall' | 'small' | 'medium';
  testID?: string;
};

export const IconSizes = {
  xsmall: 14,
  small: 18,
  medium: 24,
};

const Icon = ({ name, color, colorTone, size = 'medium', testID }: IconProps) => {
  const { colors, getColor } = useTheme();

  const handleFillColor = useMemo(() => {
    let fillColor = getColor(color, colors.white);

    if (colorTone === 'light') fillColor = Color(fillColor).lighten(0.2).hex();
    else if (colorTone === 'dark') fillColor = Color(fillColor).darken(0.5).hex();
    else return fillColor;

    return fillColor;
  }, [color, colorTone]);

  const IconSVG = Icons[name];

  return <IconSVG testID={testID} width={IconSizes[size]} height={IconSizes[size]} fill={handleFillColor} />;
};

export default Icon;
