import { customThemes as defaultCustomThemes, defaultTheme, Theme, ThemeMode } from '@uikit/common';
import type { CustomThemes } from '@uikit/common/src/theme/types';
import deepMerge from 'lodash.merge';
import { createContext, useEffect, useMemo, useState } from 'react';

type ThemeContext = {
  theme: Theme;
  activeTheme: ThemeMode;
  themes: CustomThemes;
  setActiveTheme: (value: ThemeMode) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: Partial<Theme>;
  customThemes?: CustomThemes;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: defaultTheme,
} as ThemeContext);

const ThemeProvider = ({ children, theme, customThemes }: ThemeProviderProps) => {
  const [themes, setThemes] = useState<CustomThemes>(defaultCustomThemes);
  const [themeState, setThemeState] = useState<Theme>(defaultTheme);
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('Dark Graphite');

  useEffect(() => {
    setThemes({ ...deepMerge(defaultCustomThemes, customThemes) });
  }, [customThemes]);

  const handleActiveThemeChange = (value: ThemeMode) => {
    setActiveTheme(value);
    localStorage.setItem('themeMode', value);
  };

  const getStoredActiveTheme = () => {
    const value = localStorage.getItem('themeMode');
    if (value) {
      setActiveTheme(value);
    }
  };

  useEffect(() => {
    getStoredActiveTheme();
  }, []);

  useEffect(() => {
    setThemeState({ ...deepMerge(defaultTheme, themes[activeTheme], theme) });
  }, [theme, activeTheme]);

  const contextValue: ThemeContext = useMemo(
    () => ({
      theme: themeState,
      activeTheme,
      setActiveTheme: handleActiveThemeChange,
      themes,
    }),
    [themeState, activeTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
