/* eslint-disable import/no-extraneous-dependencies */
import { render, RenderOptions } from '@testing-library/react';

import ThemeProvider from '../providers/ThemeProvider';

const AllTheProviders: React.FC = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

type Styles = {
  [key: string]: any;
};

export const mergeStyles = (styles: Styles[]) => {
  let merged: Styles = {};
  styles.forEach((style) => {
    merged = { ...merged, ...style };
  });
  return merged;
};
