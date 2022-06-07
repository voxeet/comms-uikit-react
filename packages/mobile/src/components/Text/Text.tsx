import type { ColorKey } from '@uikit/common';
import React from 'react';
import { Text } from 'react-native';

import useTheme from '../../hooks/useTheme';

import styles from './Text.style';

export type CustomTextProps = {
  children: React.ReactNode;
  testID?: string;
  type?:
    | 'H0'
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'bodyDefault'
    | 'bodySmallSemiBold'
    | 'bodySmall'
    | 'buttonDefault'
    | 'buttonSmall'
    | 'captionBold'
    | 'captionSemiBold'
    | 'captionRegular'
    | 'captionSmallSemiBold'
    | 'captionSmallRegular';
  color?: ColorKey;
  font?: string;
  uppercase?: boolean;
  align?: 'left' | 'center' | 'right';
};

const CustomText = ({
  children,
  testID,
  type = 'bodyDefault',
  color,
  font,
  uppercase = false,
  align = 'left',
}: CustomTextProps) => {
  const {
    theme: { fontFamily },
    colors,
    getColor,
  } = useTheme();

  const themeStyles = {
    fontFamily: font || fontFamily,
    color: getColor(color, colors.white),
    textAlign: align,
  };

  const stylesGroup = [styles.text, type && styles[type], uppercase && styles.uppercase, themeStyles];

  return (
    <Text testID={testID} style={stylesGroup}>
      {children}
    </Text>
  );
};

export default CustomText;
