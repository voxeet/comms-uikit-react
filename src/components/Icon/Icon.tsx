/* eslint-disable react/jsx-props-no-spreading */
import { Icons, ColorKey } from '../../common';
import type { IconsKeys, Sizes } from '../../common';
import cx from 'classnames';
import Color from 'color';
import { useMemo } from 'react';

import useTheme from '../../hooks/useTheme';

import styles from './Icon.module.scss';

export type ColorTone = 'light' | 'default' | 'dark';

export type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  name: IconsKeys;
  color?: ColorKey;
  colorTone?: ColorTone;
  size?: Extract<Sizes, 'xxs' | 'xs' | 's' | 'm'>;
  testID?: string;
};
const IconSizes = {
  xxs: 10,
  xs: 14,
  s: 18,
  m: 24,
};

const Icon = ({ name, color, colorTone = 'default', size = 'm', testID, ...props }: IconProps) => {
  const { colors, getColor } = useTheme();

  const IconSVG = Icons[name];

  const handleFillColor = useMemo(() => {
    let fillColor = getColor(color, colors.white);

    if (colorTone === 'light') fillColor = Color(fillColor).lighten(0.2).hex();
    else if (colorTone === 'dark') fillColor = Color(fillColor).darken(0.5).hex();
    else return fillColor;

    return fillColor;
  }, [color, colorTone]);

  return (
    <div data-testid={testID} className={cx(styles.icon, styles[`size-${size}`])} {...props}>
      <IconSVG data-testid="icon" width={IconSizes[size]} height={IconSizes[size]} fill={handleFillColor} />
    </div>
  );
};

export default Icon;
