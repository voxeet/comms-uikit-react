import cx from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, useMemo } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { Sizes } from '../../../theme/types';

import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
  size?: Extract<Sizes, 'l' | 'm' | 's'>;
  fw?: boolean;
}

const colorsMap: Record<
  string,
  Record<
    string,
    { background: string; hover: string; text: string; border?: string; hoverBorder?: string; hoverText?: string }
  >
> = {
  primary: {
    base: {
      background: 'primary.400',
      hover: 'primary.500',
      text: 'white',
    },
    active: {
      background: 'primary.400',
      hover: 'primary.500',
      text: 'white',
    },
    disabled: {
      background: 'grey.200',
      hover: 'grey.200',
      text: 'white',
    },
    danger: {
      background: 'infoError',
      hover: 'red.600',
      text: 'white',
    },
  },
  secondary: {
    base: {
      background: 'transparent',
      hover: 'transparent',
      text: 'primary.400',
      hoverText: 'primary.500',
      border: 'primary.400',
      hoverBorder: 'primary.500',
    },
    active: {
      background: 'transparent',
      text: 'primary.600',
      hover: 'primary.500',
      border: 'primary.600',
    },
    disabled: {
      background: 'transparent',
      hover: 'grey.200',
      text: 'grey.200',
      border: 'grey.200',
    },
    danger: {
      background: 'transparent',
      hover: 'transparent',
      text: 'infoError',
      hoverText: 'red.600',
      border: 'infoError',
      hoverBorder: 'red.600',
    },
  },
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  danger = false,
  testID,
  variant = 'primary',
  className,
  size = 'l',
  fw,
  ...props
}) => {
  const { getColor, borderRadius } = useTheme();
  const variantStyle = useMemo(() => {
    const { base, disabled, active, danger } = colorsMap[variant];
    return {
      borderRadius,
      background: getColor(base.background),
      color: getColor(base.text),
      border: base.border ? '2px solid' : undefined,
      borderColor: getColor(base.border),
      '&:not(&:disabled):hover': {
        background: getColor(base.hover),
        borderColor: getColor(base.hoverBorder),
        boxShadow: '0 8px 14px rgba(106, 106, 109, 0.28)',
        color: getColor(base.hoverText),
      },
      '&:disabled': {
        background: getColor(disabled.background),
        borderColor: getColor(disabled.border),
        color: getColor(disabled.text),
      },
      '&:not(&:disabled):active': {
        background: getColor(active.hover),
      },
      '&.danger': {
        background: getColor(danger.background),
        borderColor: getColor(danger.border),
        color: getColor(danger.text),
      },
      '&.danger:not(&:disabled):hover': {
        background: getColor(danger.hover),
        borderColor: getColor(danger.hoverBorder),
        boxShadow: '0 8px 14px rgba(106, 106, 109, 0.28)',
        color: getColor(danger.hoverText),
      },
    };
  }, [variant]);
  return (
    <button
      className={cx(styles.button, danger && 'danger', styles[`size-${size}`], fw && styles.fullWidth, className)}
      data-testid={testID}
      type="button"
      css={variantStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
