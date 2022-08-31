import type { ColorKey, Theme, ThemeMode } from '../../common';
import type { CustomThemes } from '../../common/theme/types';

export type Theming = {
  /**
   * Gets the theme object.
   */
  theme: Theme;

  /**
   * Gets the object of themes in project.
   */
  themes: CustomThemes;

  /**
   * Gets the currently used theme mode name.
   */
  activeTheme: ThemeMode;

  /**
   * Gets array of available theme names.
   */
  availableThemes: string[];

  /**
   * Sets a theme mode.
   * @param value - the ThemeMode object to set.
   */
  setActiveTheme: (value: ThemeMode) => void;

  /**
   * Gets the gradient of the provided colors or the color that is used in the theme.
   */
  getColorOrGradient: (color?: ColorKey | [ColorKey, ColorKey], fallback?: string) => string | string[];

  /**
   * Gets the color of the theme.
   */
  getColor: (color?: ColorKey, fallback?: string) => string;

  /**
   * Gets the gradient value of the theme.
   */
  getGradient: (color?: [ColorKey, ColorKey], fallback?: string) => string[];
  /**
   * Gets the current window width.
   */
  windowWidth: number | undefined;
  /**
   * /**
   * Gets the current window height.
   */
  windowHeight: number | undefined;
  /**
   * Informs if current device is mobile.
   */
  isMobile: boolean;
  /**
   * Informs if current device is mobile and has less than 375px width.
   */
  isMobileSmall: boolean;
  /**
   * Informs if current device is tablet.
   */
  isTablet: boolean;
  /**
   * Informs if current device is desktop.
   */
  isDesktop: boolean;
  /**
   * Informs if current device screen is in landscape mode.
   */
  isLandscape: boolean;
  /**
   * Informs if current device is in portrait mode.
   */
  isPortrait: boolean;
};

export type UseTheme = () => Theming & Theme;
