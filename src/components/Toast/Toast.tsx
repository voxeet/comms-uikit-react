/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import type { ColorKey } from '../../common';
import cx from 'classnames';
import type React from 'react';

import useTheme from '../../hooks/useTheme';

import styles from './Toast.module.scss';

type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  backgroundColor?: ColorKey;
  isVisible?: boolean;
  testID?: string;
};

const Toast = ({ children, backgroundColor = 'greyAlpha.800', isVisible, testID, ...props }: ToastProps) => {
  const { getColor } = useTheme();

  return (
    <div
      data-testid={testID}
      className={cx(styles.toast, !isVisible && styles.invisible)}
      style={{ backgroundColor: getColor(backgroundColor) }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Toast;
