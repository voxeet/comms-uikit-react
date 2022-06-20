/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../common';
import { useMemo, useRef } from 'react';

import useTheme from '../../hooks/useTheme';
import IconButton from '../IconButton/IconButton';
import Text from '../Text/Text';

import styles from './Input.module.scss';

export type ValidationType = { valid: boolean; message?: string };

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  label?: string;
  borderColor?: ColorKey;
  invalidBorderColor?: ColorKey;
  labelColor?: ColorKey;
  labelBackground?: ColorKey;
  textColor?: ColorKey;
  validation?: ValidationType;
  testID?: string;
};

const Input = ({
  label,
  value,
  onChange,
  borderColor,
  invalidBorderColor,
  labelColor,
  textColor,
  labelBackground,
  validation,
  testID,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { getColor } = useTheme();

  const handleBorderColor = useMemo(() => {
    if (validation && !validation.valid && value.length > 0) {
      return getColor(invalidBorderColor || 'red.500');
    }
    return getColor(borderColor || 'blue.300');
  }, [validation, value]);

  const clear = () => {
    if (inputRef && inputRef.current && onChange) {
      const e = new Event('input', { bubbles: true });
      inputRef.current.value = '';
      Object.defineProperty(e, 'target', { writable: false, value: inputRef.current });
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <div className={styles.wrapper} data-testid={testID}>
        {label && (
          <span className={styles.label} style={{ backgroundColor: getColor(labelBackground, 'white') }}>
            <Text type="bodySmall" color={getColor(labelColor, 'grey.500')}>
              {label}
            </Text>
          </span>
        )}
        {value.length > 0 && (
          <div className={styles.clear}>
            <IconButton
              icon="close"
              backgroundColor="transparent"
              color={textColor}
              onClick={clear}
              iconColor={getColor(textColor, 'black')}
              size="xxs"
            />
          </div>
        )}
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={onChange}
          style={{
            borderColor: handleBorderColor,
            color: getColor(textColor, 'black'),
          }}
          {...props}
        />
      </div>
      {validation && !validation.valid && validation.message && value.length > 0 && (
        <div className={styles.error}>
          <Text color={invalidBorderColor || 'red.500'} type="bodySmall">
            {validation.message}
          </Text>
        </div>
      )}
    </>
  );
};

export default Input;
