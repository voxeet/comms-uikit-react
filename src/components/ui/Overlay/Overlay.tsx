import cx from 'classnames';
import Color from 'color';
import type { ComponentProps, ReactNode } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';

import styles from './Overlay.module.scss';

type OverlayProps = {
  children?: ReactNode;
  testID?: string;
  opacity?: number;
  onClick?: () => void;
  visible?: boolean;
  color?: ColorKey;
  nested?: boolean;
} & ComponentProps<typeof Space>;

const Overlay = ({
  visible = true,
  children,
  testID = 'Overlay',
  onClick,
  color,
  opacity = 0.8,
  nested,
  ...props
}: OverlayProps) => {
  const { getColor } = useTheme();

  return visible ? (
    <Space
      onClick={onClick}
      testID={testID}
      className={cx(styles.overlay, { [styles.nested]: nested })}
      style={{
        backgroundColor: Color(getColor(color || 'grey.800'))
          .alpha(opacity)
          .string(),
      }}
      {...props}
    >
      {children}
    </Space>
  ) : null;
};

export default Overlay;
