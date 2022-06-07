import AsyncStorage from '@react-native-async-storage/async-storage';
import { customThemes, defaultTheme, Theme, ThemeMode } from '@uikit/common';
import deepMerge from 'lodash.merge';
import React, { createContext, useState, useEffect, useMemo } from 'react';

type ThemeContext = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => Promise<void>;
};

type ThemeProviderProps = {
  theme?: Theme;
};

export const ThemeContext = createContext<ThemeContext>({ theme: defaultTheme } as ThemeContext);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
  const [themeState, setThemeState] = useState(defaultTheme);
  const [themeModeState, setThemeModeState] = useState<ThemeMode>('darkGraphite');

  const setThemeMode = async (value: ThemeMode) => {
    setThemeModeState(value);
    try {
      await AsyncStorage.setItem('themeMode', value);
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredThemeMode = async () => {
    try {
      const value = await AsyncStorage.getItem('themeMode');
      if (value) {
        setThemeModeState(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoredThemeMode();
  }, [setThemeMode, themeModeState]);

  useEffect(() => {
    setThemeState({ ...deepMerge(defaultTheme, customThemes[themeModeState], theme) });
  }, [theme, themeModeState]);

  const contextValue: ThemeContext = useMemo(
    () => ({
      theme: themeState,
      themeMode: themeModeState,
      setThemeMode,
    }),
    [themeState, themeModeState],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
