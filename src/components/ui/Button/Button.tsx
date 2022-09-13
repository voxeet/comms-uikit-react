/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import type { ButtonHTMLAttributes, FunctionComponent } from 'react';

import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  testID?: string;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  danger = false,
  testID,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button
      className={cx(
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'tertiary' && styles.tertiaryButton,
        danger && styles.danger,
        className,
      )}
      data-testid={testID}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
