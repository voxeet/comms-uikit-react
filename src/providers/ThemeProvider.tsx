import deepMerge from 'lodash.merge';
import React, { createContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import defaultCustomThemes from '../theme/customThemes';
import defaultTheme from '../theme/defaultTheme';
import type { CustomThemes, RecursivePartial, Theme, ThemeMode } from '../theme/types';

import '../style/font.css';

export type WindowDimensions = {
  width: number;
  height: number;
};

export type ThemeContext = {
  theme: Theme;
  activeTheme: ThemeMode;
  themes: CustomThemes;
  setActiveTheme: (value: ThemeMode) => void;
  windowDimensions: WindowDimensions;
  isMobile: boolean;
  isMobileSmall: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
};

export type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: RecursivePartial<Theme>;
  customThemes?: CustomThemes;
  values?: Partial<ThemeContext>;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: defaultTheme,
} as unknown as ThemeContext);

export const breakpoints = {
  mobileSmall: 320,
  mobile: 600,
  tablet: 1024,
  desktop: 1440,
};

const isMobileBrowser =
  (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android|iPhone|mobile/i)) ||
  /*
   * Apple tablets are faking userAgent by default to treat them as desktop browsers, additional check for Apple devices
   */
  (navigator?.platform === 'MacIntel' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0);

const ThemeProvider = ({ children, theme, customThemes, values }: ThemeProviderProps) => {
  const [themes, setThemes] = useState<CustomThemes>(defaultCustomThemes);
  const [themeState, setThemeState] = useState<Theme>(defaultTheme);
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('Dark Graphite');
  const [windowDimensions, setWindowDimensions] = useState<ThemeContext['windowDimensions']>({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState<ThemeContext['isMobile']>(false);
  const [isMobileSmall, setIsMobileSmall] = useState<ThemeContext['isMobileSmall']>(false);
  const [isTablet, setIsTablet] = useState<ThemeContext['isTablet']>(false);
  const [isDesktop, setIsDesktop] = useState<ThemeContext['isDesktop']>(!isMobileBrowser);
  const [isLandscape, setIsLandscape] = useState<ThemeContext['isLandscape']>(false);
  const [isPortrait, setIsPortrait] = useState<ThemeContext['isPortrait']>(false);

  const handleDimensions = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleScreenOrientation = () => {
    if (isDesktop) {
      if (window.innerWidth < window.innerHeight) {
        setIsPortrait(true);
        setIsLandscape(false);
      } else {
        setIsPortrait(false);
        setIsLandscape(true);
      }
    } else {
      const isPortrait = Math.abs(window.orientation || 0) / 90 !== 1;
      setIsPortrait(isPortrait);
      setIsLandscape(!isPortrait);
    }
  };

  const handleDeviceType = () => {
    let mainDimension = window.innerWidth;

    if (window.innerWidth > window.innerHeight) {
      mainDimension = window.innerHeight;
    }
    if (window.innerWidth <= breakpoints.tablet || isMobileBrowser) {
      if (mainDimension <= breakpoints.mobileSmall) {
        setIsMobile(false);
        setIsMobileSmall(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (mainDimension <= breakpoints.mobile) {
        setIsMobile(true);
        setIsMobileSmall(false);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (mainDimension <= breakpoints.tablet || isMobileBrowser) {
        setIsMobile(false);
        setIsMobileSmall(false);
        setIsTablet(true);
        setIsDesktop(false);
      }
    } else {
      setIsMobile(false);
      setIsMobileSmall(false);
      setIsTablet(false);
      setIsDesktop(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      handleDimensions();
      if (isMobileBrowser) {
        handleScreenOrientation();
      }
      handleDeviceType();
    };
    handleResize();
    if (!isMobileBrowser) {
      window.addEventListener('resize', handleResize);
      return () => () => window.removeEventListener('resize', handleResize);
    }
    window.addEventListener('orientationchange', handleResize);
    return () => window.removeEventListener('orientationchange', handleResize);
  }, []);

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
    setThemeState({ ...deepMerge(defaultTheme, themes[activeTheme], theme) } as Theme);
  }, [theme, activeTheme]);

  // Expose every theme token as a CSS variable
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function exposeTokens(name: string[], val: Record<string, any> | string | number) {
      if (typeof val === 'object' && val !== null) {
        for (const [key, value] of Object.entries(val)) {
          exposeTokens([...name, key], value);
        }
        return;
      }
      // Assume that any numbers are using pixel units
      const formattedValue = typeof val === 'number' ? `${val}px` : val;
      document.documentElement.style.setProperty(`--${name.join('-')}`, formattedValue);
    }

    exposeTokens([], themeState);
  }, [themeState]);

  const contextValue: ThemeContext = useMemo(
    () => ({
      theme: themeState,
      activeTheme,
      setActiveTheme: handleActiveThemeChange,
      themes,
      windowDimensions,
      isMobile,
      isMobileSmall,
      isTablet,
      isDesktop,
      isLandscape,
      isPortrait,
      ...values,
    }),
    [themeState, activeTheme, windowDimensions, isMobile, isMobileSmall, isTablet, isDesktop, isLandscape, isPortrait],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
