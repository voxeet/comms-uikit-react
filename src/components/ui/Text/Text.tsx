import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';

import styles from './Text.module.scss';

/**
 * @deprecated Migrate to the new text types at TextType
 */
export type DeprecatedTextTypes =
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

export type TextType =
  | DeprecatedTextTypes
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h4Thin'
  | 'h5Bold'
  | 'h5Regular'
  | 'h6'
  | 'subtitleLarge'
  | 'subtitleSmall'
  | 'paragraphLarge'
  | 'paragraphMedium'
  | 'paragraphSmall'
  | 'paragraphExtraSmall'
  | 'eyebrowLargeBold'
  | 'eyebrowLargeRegular'
  | 'eyebrowSmall'
  | 'caption'
  | 'captionDemiBold'
  | 'captionSmall'
  | 'captionSmallDemiBold'
  | 'captionSmallDemiBoldMobile'
  | 'quoteLarge'
  | 'quoteSmall'
  | 'button'
  | 'textLink';

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
  className,
  ...props
}: TextProps) => {
  const {
    theme: { fontFamily },
    getColor,
  } = useTheme();
  return (
    <span
      data-testid={testID}
      className={cx(
        className,
        styles.text,
        styles[`type-${type}`],
        styles[`align-${align}`],
        uppercase && styles.uppercase,
      )}
      style={{
        color: getColor(color, 'white'),
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
