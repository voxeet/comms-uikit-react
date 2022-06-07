import type { ColorKey } from '@uikit/common';
import { useCallback, useContext, useMemo } from 'react';

import { ThemeContext } from '../providers/ThemeProvider';

const useTheme = () => {
  const { theme, themes, activeTheme, setActiveTheme } = useContext(ThemeContext);

  const availableThemes = useMemo(() => (themes ? Object.keys(themes) : []), [themes]);

  const defaultColor = useMemo(() => {
    return theme.colors.grey[400] || 'grey';
  }, [theme]);

  const findColor = (color?: string) => {
    let convertedColor: string | undefined;
    if (color) {
      if (color.charAt(0) === '#' || color.substring(0, 3) === 'rgb') {
        return color;
      }
      const withHue = color.split('.');
      const selectedColor = theme.colors[withHue[0]];
      if (withHue.length === 1) {
        // color has hues
        if (typeof selectedColor === 'string') {
          convertedColor = selectedColor;
        } else {
          convertedColor = selectedColor?.[400];
        }
      } else if (withHue.length === 2) {
        // @ts-expect-error we have fallback color if it is undefined
        convertedColor = selectedColor?.[withHue[1]];
      }
    }
    return convertedColor || defaultColor;
  };

  const getColor = useCallback(
    (color?: ColorKey, fallback?: string) => {
      const fallbackColor: string = findColor(fallback) || defaultColor;
      if (color) {
        return findColor(color);
      }
      return fallbackColor;
    },
    [theme],
  );

  const getGradient = useCallback(
    (color?: [ColorKey, ColorKey], fallback?: string) => {
      if (color) {
        return [getColor(color[0], fallback), getColor(color[1], fallback)];
      }
      return [getColor(color, fallback), getColor(color, fallback)];
    },
    [theme],
  );

  const getColorOrGradient = useCallback(
    (color?: ColorKey | [ColorKey, ColorKey], fallback?: string) => {
      if (Array.isArray(color)) {
        return getGradient(color);
      }
      return getColor(color, fallback);
    },
    [theme],
  );

  return {
    theme,
    themes,
    activeTheme,
    setActiveTheme,
    availableThemes,
    getColorOrGradient,
    getColor,
    getGradient,
    ...theme,
  };
};

export default useTheme;
