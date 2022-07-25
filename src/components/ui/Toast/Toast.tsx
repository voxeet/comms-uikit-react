/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import type { ColorKey } from '../../../common';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import Space from '../Space/Space';

import styles from './Toast.module.scss';

type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  backgroundColor?: ColorKey;
  isVisible?: boolean;
  testID?: string;
};

const Toast = ({ children, backgroundColor = 'greyAlpha.800', isVisible, testID, ...props }: ToastProps) => {
  const { getColor } = useTheme();

  return (
    <Space
      pv="xxs"
      ph="s"
      mb="xxxs"
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
