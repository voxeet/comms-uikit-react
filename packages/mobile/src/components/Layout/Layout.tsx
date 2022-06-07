import type { ColorKey } from '@uikit/common';
import React from 'react';
import { View } from 'react-native';

import useTheme from '../../hooks/useTheme';

import styles from './Layout.style';

type LayoutProps = {
  children: React.ReactNode;
  backgroundColor?: ColorKey;
  testID?: string;
};

const Layout = ({ children, backgroundColor, testID }: LayoutProps) => {
  const { colors, getColor } = useTheme();
  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor: getColor(backgroundColor, colors.background),
        },
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default Layout;
