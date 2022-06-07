/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import type { ButtonHTMLAttributes, FunctionComponent } from 'react';

import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  // TODO: Implement loading state, confirm whether we need an animated icon
  loading?: boolean;
  testID?: string;
}

const Button: FunctionComponent<ButtonProps> = ({ children, testID, variant, ...props }) => (
  <button
    className={cx(
      variant === 'primary' && styles.primaryButton,
      variant === 'secondary' && styles.secondaryButton,
      variant === 'tertiary' && styles.tertiaryButton,
    )}
    data-testid={testID}
    type="button"
    {...props}
  >
    {variant === 'secondary' ? (
      <div className={styles.buttonText}>
        <span className={styles.gradientText}>{children}</span>
      </div>
    ) : (
      children
    )}
  </button>
);

export default Button;
