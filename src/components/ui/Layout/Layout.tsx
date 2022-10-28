import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';

import styles from './Layout.module.scss';

export type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  backgroundColor?: ColorKey;
  style?: React.CSSProperties;
  testID?: string;
};

const Layout = ({ children, backgroundColor, testID, style, ...props }: LayoutProps) => {
  const { getColor } = useTheme();
  return (
    <Space
      testID={testID}
      className={styles.layout}
      style={{ backgroundColor: getColor(backgroundColor, 'background'), ...style }}
      {...props}
    >
      {children}
    </Space>
  );
};

export default Layout;
