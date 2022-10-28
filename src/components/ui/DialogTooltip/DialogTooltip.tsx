import cx from 'classnames';
import type { HTMLAttributes, ReactNode } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';

import styles from './DialogTooltip.module.scss';

export type Position = 'top' | 'bottom';

export type DialogTooltipProps = HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  children?: ReactNode;
  position?: Position;
  isVisible?: boolean;
  backgroundColor?: ColorKey;
};

const DialogTooltip = ({
  children,
  testID = 'DialogTooltip',
  position = 'top',
  isVisible = false,
  backgroundColor = 'grey.800',
  ...props
}: DialogTooltipProps) => {
  const { getColor } = useTheme();

  return isVisible ? (
    <Space
      p="s"
      testID={testID}
      className={cx(styles.wrapper, styles[position])}
      style={{ backgroundColor: getColor(backgroundColor) }}
      {...props}
    >
      {children}
      <div className={cx(styles[position === 'bottom' ? 'arrowUp' : 'arrowDown'])} data-testid="triangle">
        <svg width="18" height="16" viewBox="0 0 18 16">
          <path
            opacity="0.98"
            d="M10.7321 15C9.96225 16.3333 8.03775 16.3333 7.26795 15L0.339748 3C-0.430052 1.66667 0.5322 -1.78935e-06 2.0718 -1.65476e-06L15.9282 -4.43391e-07C17.4678 -3.08794e-07 18.4301 1.66667 17.6603 3L10.7321 15Z"
            fill={getColor(backgroundColor)}
          />
        </svg>
      </div>
    </Space>
  ) : null;
};

export default DialogTooltip;
