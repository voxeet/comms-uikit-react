import type { ColorKey } from '@uikit/common';
import { useCallback, useContext } from 'react';

import { ThemeContext } from '../providers/ThemeProvider';

const useTheme = () => {
  const { theme, themeMode, setThemeMode } = useContext(ThemeContext);

  const getColor = useCallback(
    (color?: ColorKey, fallback?: string) => {
      const fallbackColor = fallback || theme.colors.grey[400];
      if (color) {
        let convertedColor: string | undefined;
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
        return convertedColor || fallbackColor;
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

  return { theme, themeMode, setThemeMode, colors: theme.colors, getColorOrGradient, getColor, getGradient };
};

export default useTheme;
