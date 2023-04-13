import cx from 'classnames';
import Color from 'color';
import React, { useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey, Sizes } from '../../../theme/types';
import Space from '../Space/Space';

import styles from './Icon.module.scss';
import IconComponents from './IconComponents';
import type { IconComponentName } from './IconComponents';

export type ColorTone = 'light' | 'default' | 'dark';

export type IconProps = React.HTMLAttributes<HTMLDivElement> & {
  name: IconComponentName;
  color?: ColorKey;
  colorTone?: ColorTone;
  size?: Extract<Sizes, 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'>;
  testID?: string;
};

const Icon = ({ name, color, colorTone = 'default', size = 'm', testID, ...props }: IconProps) => {
  const { getColor, theme } = useTheme();

  const IconSVG = IconComponents[name];

  const handleFillColor = useMemo(() => {
    let fillColor = getColor(color, 'white');

    if (colorTone === 'light') fillColor = Color(fillColor).lighten(0.2).hex();
    else if (colorTone === 'dark') fillColor = Color(fillColor).darken(0.5).hex();
    else return fillColor;

    return fillColor;
  }, [color, colorTone, theme]);

  return (
    <Space
      testID={testID ?? `${name}Icon`}
      className={cx(styles.icon, styles[`size-${size}`], { [styles.clickable]: !!props.onClick })}
      {...props}
    >
      <IconSVG testID={name} fill={handleFillColor} />
    </Space>
  );
};

export default Icon;
