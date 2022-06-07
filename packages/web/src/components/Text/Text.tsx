/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '@uikit/common';
import cx from 'classnames';

import useTheme from '../../hooks/useTheme';

import styles from './Text.module.scss';

export type TextType =
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
  | 'captionSmallRegular'
  | 'avatar-xs'
  | 'avatar-s'
  | 'avatar-m'
  | 'avatar-l'
  | 'pill'
  | 'pill-s';

export type TextProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  testID?: string;
  type?: TextType;
  color?: ColorKey;
  font?: string;
  uppercase?: boolean;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
};

const Text = ({
  children,
  testID,
  type = 'bodyDefault',
  color,
  font,
  uppercase = false,
  align = 'left',
  style,
  ...props
}: TextProps) => {
  const {
    theme: { fontFamily },
    colors,
    getColor,
  } = useTheme();
  return (
    <span
      data-testid={testID}
      className={cx(styles.text, styles[`type-${type}`], styles[`align-${align}`], uppercase && styles.uppercase)}
      style={{
        color: getColor(color, colors.white),
        fontFamily: font || fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;
