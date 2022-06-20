/* eslint-disable react/jsx-props-no-spreading */
import type { IconsKeys, ColorKey, Sizes } from '../../../common';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import Icon from '../../Icon/Icon';

import styles from './IconIndicator.module.scss';

type IconIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: IconsKeys;
  backgroundColor?: ColorKey;
  iconColor?: ColorKey;
  size?: Extract<Sizes, 's' | 'm'>;
  testID?: string;
};

const IconIndicator = ({ icon, backgroundColor, iconColor, size = 'm', testID, ...props }: IconIndicatorProps) => {
  const { colors, getColor } = useTheme();
  return (
    <div
      data-testid={testID}
      className={cx(styles.indicator, styles[`size-${size}`])}
      style={{
        backgroundColor: getColor(backgroundColor, colors.whiteAlpha[500]),
      }}
      {...props}
    >
      <Icon testID="Icon" name={icon} color={iconColor} size={size === 'm' ? 's' : 'xs'} />
    </div>
  );
};

export default IconIndicator;
