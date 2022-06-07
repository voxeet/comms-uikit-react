/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '@uikit/common';

import useTheme from '../../hooks/useTheme';

import styles from './Layout.module.scss';

type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  backgroundColor?: ColorKey;
  testID?: string;
  style?: React.CSSProperties;
};

const Layout = ({ children, backgroundColor, testID, style, ...props }: LayoutProps) => {
  const { getColor } = useTheme();
  return (
    <div
      data-testid={testID}
      className={styles.layout}
      style={{ backgroundColor: getColor(backgroundColor, 'background'), ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Layout;
