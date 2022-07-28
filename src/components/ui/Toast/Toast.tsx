/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import type { ColorKey } from '../../../common';
import type { SpaceValues } from '../../../common/theme/types';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import Space from '../Space/Space';

import styles from './Toast.module.scss';

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: ColorKey;
  isVisible?: boolean;
  testID?: string;
  pv?: SpaceValues; // Padding Vertical (padding-top & padding-bottom)
  ph?: SpaceValues; // Padding Horizontal (padding-left & padding-right)
  mb?: SpaceValues; // margin-bottom
};

const Toast = ({
  children,
  backgroundColor = 'greyAlpha.800',
  isVisible,
  testID,
  pv,
  ph,
  mb,
  ...props
}: ToastProps) => {
  const { getColor } = useTheme();

  return (
    <Space
      pv={pv || 'xxs'}
      ph={ph || 's'}
      mb={mb || 'xxxs'}
      testID={testID}
      className={cx(styles.toast, !isVisible && styles.invisible)}
      style={{ backgroundColor: getColor(backgroundColor) }}
      {...props}
    >
      {children}
    </Space>
  );
};

export default Toast;
