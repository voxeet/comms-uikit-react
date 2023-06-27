import cx from 'classnames';
import Color from 'color';
import { CSSProperties, useMemo, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Tooltip.module.scss';

export type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
  backgroundColor?: ColorKey;
  textColor?: ColorKey;
  testID?: string;
  tooltipStyle?: CSSProperties;
};

const Tooltip = ({
  text,
  position = 'top',
  children,
  backgroundColor,
  textColor,
  testID,
  tooltipStyle,
  ...props
}: TooltipProps) => {
  const { getColor } = useTheme();
  const [isActive, setIsActive] = useState<boolean>(false);

  const tooltipBackgroundColor = useMemo(() => {
    if (backgroundColor) {
      return getColor(backgroundColor);
    }

    return Color(getColor('grey.700')).hex();
  }, [backgroundColor]);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      {...props}
    >
      {children}
      {text && isActive && (
        <div
          className={cx(styles.tooltip, styles[position])}
          style={{ backgroundColor: tooltipBackgroundColor, ...tooltipStyle }}
          data-testid={testID}
        >
          <Space pv="xxs" ph="xs">
            <Text color={getColor(textColor, 'white')} type="captionSmall">
              {text}
            </Text>
          </Space>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
