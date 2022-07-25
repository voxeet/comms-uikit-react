import type customThemes from './customThemes';
import type defaultTheme from './defaultTheme';

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type ColorHues = {
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type ColorKey = string;
export type Colors = Record<string, Partial<ColorHues> | string>;

export type Theme = {
  colors: Colors;
  spaces: typeof defaultTheme['spaces'];
  avatars: string[];
  // SHADOWS
  shadowColor?: string; // mobile only
  shadowOffsetWidth?: number; // mobile only
  shadowOffsetHeight?: number; // mobile only
  shadowOpacity?: number; // mobile only
  shadowRadius?: number; // mobile only
  shadowElevation?: number; // mobile only
  // FONTS
  fontFamily?: string;
  // BORDERS
  borderRadius?: number;
};

export type CustomThemes = Record<string, RecursivePartial<Theme>>;

export type test = CustomThemes['dark'];

export type ThemeMode = keyof typeof customThemes;

export type SpaceValues = keyof typeof defaultTheme['spaces'];

export type Sizes = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
