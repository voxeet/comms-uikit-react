/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';
import { useRef } from 'react';

import useTheme from '../../../hooks/useTheme';
import IconButton from '../IconButton/IconButton';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Input.module.scss';

export type ValidationType = { valid: boolean; message?: string };

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  label?: string;
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
  labelColor,
  textColor,
  labelBackground,
  validation,
  testID,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { getColor, theme } = useTheme();

  const clear = () => {
    if (inputRef && inputRef.current && onChange) {
      const e = new Event('input', { bubbles: true });
      inputRef.current.value = '';
      Object.defineProperty(e, 'target', { writable: false, value: inputRef.current });
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div>
      <Space className={styles.wrapper} testID={testID}>
        {label && (
          <Space
            tag="span"
            pv="xxxs"
            ph="xxs"
            className={styles.label}
            style={{ backgroundColor: getColor(labelBackground, 'white') }}
          >
            <Text type="captionRegular" color={getColor(labelColor, 'grey.500')}>
              {label}
            </Text>
          </Space>
        )}
        {value.length > 0 && (
          <Space className={styles.clear}>
            <IconButton
              icon="close"
              backgroundColor="transparent"
              color={textColor}
              onClick={clear}
              iconColor={getColor(textColor, 'black')}
              size="xxs"
            />
          </Space>
        )}
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={onChange}
          css={{
            border: '2px solid',
            borderColor: validation?.valid === false ? getColor('infoError') : getColor('grey.100'),
            color: getColor('black'),
            '&:focus': {
              borderColor: validation?.valid === false ? getColor('infoError') : getColor('primary.400'),
            },
            fontFamily: theme.fontFamily,
          }}
          {...props}
        />
      </Space>
      {validation?.message && (
        <Space mt="xs" className={styles.error}>
          <Text
            color={validation?.valid === false ? getColor('infoError') : getColor('grey.600')}
            type="captionRegular"
          >
            {validation.message}
          </Text>
        </Space>
      )}
    </div>
  );
};

export default Input;
