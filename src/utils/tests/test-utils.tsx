/* eslint-disable import/no-extraneous-dependencies */
import '../../../__mocks__/MediaStream.mock';
import '../../../__mocks__/documentExec.mock';
import '../../../__mocks__/WindowOrientation.mock';
import 'jest-canvas-mock';
import { render, RenderOptions } from '@testing-library/react';

import CommsProvider, { CommsProviderProps } from '../../providers/CommsProvider';
import ThemeProvider, { ThemeContext, ThemeProviderProps } from '../../providers/ThemeProvider';

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

type WithProviderRender = {
  commsProps?: Partial<CommsProviderProps>;
  themeProps?: ThemeProviderProps;
  themeValues?: Partial<ThemeContext>;
  options?: Omit<RenderOptions, 'wrapper'>;
};

const withProvidersRender = (
  ui: React.ReactElement,
  { commsProps, themeProps, options, themeValues }: WithProviderRender = {},
) =>
  render(
    <CommsProvider token={token} refreshToken={refreshToken} {...commsProps} value={{ ...value, ...commsProps?.value }}>
      <ThemeProvider {...themeProps} values={{ ...themeValues }}>
        {ui}
      </ThemeProvider>
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

export const navigatorReturnMock = (args?: Record<string, string>) =>
  ({
    mediaDevices: {
      getUserMedia: jest.fn(async () => {
        return new Promise((resolve) => {
          resolve({
            getVideoTracks: jest.fn(() => [{ stop: () => false }] as unknown as MediaStreamTrack[]),
            getAudioTracks: jest.fn(() => [{ stop: () => false }] as unknown as MediaStreamTrack[]),
            getTracks: jest.fn(
              () => [{ stop: () => false, getCapabilities: jest.fn() }] as unknown as MediaStreamTrack[],
            ),
          });
        });
      }),
    },
    ...args,
  } as unknown as Navigator);

export const setupHook = <T extends () => ReturnType<T>>(hook: T, options?: WithProviderRender) => {
  const returnVal = {};
  const Vessel = () => {
    Object.assign(returnVal, hook());
    return null;
  };
  withProvidersRender(<Vessel />, options);
  return returnVal as ReturnType<typeof hook>;
};
