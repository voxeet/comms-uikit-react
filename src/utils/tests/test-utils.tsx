/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import '../../../__mocks__/MediaStream.mock';
import '../../../__mocks__/documentExec.mock';
import 'jest-canvas-mock';
import { render, RenderOptions } from '@testing-library/react';

import CommsProvider, { CommsProviderProps } from '../../providers/CommsProvider';
import ThemeProvider, { ThemeProviderProps } from '../../providers/ThemeProvider';

import { value } from './CommsProviderData';

const token = 'token';
const refreshToken = jest.fn();

const themeRender = (
  ui: React.ReactElement,
  { themeProps, options }: { themeProps?: Partial<ThemeProviderProps>; options?: RenderOptions } = {},
) => render(<ThemeProvider {...themeProps}>{ui}</ThemeProvider>, { ...options });

const commsRender = (
  ui: React.ReactElement,
  { commsProps, options }: { commsProps?: Partial<CommsProviderProps>; options?: RenderOptions } = {},
) =>
  render(
    <CommsProvider token={token} refreshToken={refreshToken} {...commsProps} value={{ ...value, ...commsProps?.value }}>
      {ui}
    </CommsProvider>,
    { ...options },
  );

const withProvidersRender = (
  ui: React.ReactElement,
  {
    commsProps,
    themeProps,
    options,
  }: {
    commsProps?: Partial<CommsProviderProps>;
    themeProps?: ThemeProviderProps;
    options?: Omit<RenderOptions, 'wrapper'>;
  } = {},
) =>
  render(
    <CommsProvider token={token} refreshToken={refreshToken} {...commsProps} value={{ ...value, ...commsProps?.value }}>
      <ThemeProvider {...themeProps}>{ui}</ThemeProvider>
    </CommsProvider>,
    { ...options },
  );

// re-export everything
export * from '@testing-library/react';

// override render method
export { withProvidersRender as render, themeRender, commsRender };

type Styles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const mergeStyles = (styles: Styles[]) => {
  let merged: Styles = {};
  styles.forEach((style) => {
    merged = { ...merged, ...style };
  });
  return merged;
};
