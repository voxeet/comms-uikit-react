import cx from 'classnames';
import { useRef, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Icon from '../Icon/Icon';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Input.module.scss';

export type ValidationType = { valid: boolean; message?: string };

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  backgroundColor?: ColorKey;
  borderColor?: ColorKey;
  value: string;
  label?: string;
  labelColor?: ColorKey;
  labelBackground?: ColorKey;
  textColor?: ColorKey;
  validation?: ValidationType;
  testID?: string;
  secure?: boolean;
};

const Input = ({
  label,
  value,
  onChange,
  labelColor,
  textColor,
  labelBackground,
  validation,
  secure,
  borderColor,
  testID,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValueHidden, setIsValueHidden] = useState(secure);
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
    <div style={{ backgroundColor: 'inherit' }}>
      <Space className={styles.wrapper} testID={testID}>
        {label && (
          <Space
            tag="span"
            pv="xxxs"
            ph="xxs"
            className={styles.label}
            style={{
              backgroundColor: getColor(labelBackground, 'background'),
            }}
          >
            <Text
              className={styles.labelText}
              testID="Label"
              type="captionRegular"
              color={getColor(labelColor, 'grey.500')}
            >
              {label}
            </Text>
          </Space>
        )}
        {(value.length > 0 || secure) && (
          <Space className={styles.actions}>
            {value.length > 0 && (
              <Space mr={secure && 'xs'}>
                <Icon testID="CloseIcon" name="close" onClick={clear} color={getColor(textColor, 'black')} size="xxs" />
              </Space>
            )}
            {secure && (
              <Icon
                testID="SecureIcon"
                name={!isValueHidden ? 'eyeOpen' : 'eyeClosed'}
                onClick={() => setIsValueHidden((prev) => !prev)}
                color={getColor(textColor, 'black')}
                size="m"
              />
            )}
          </Space>
        )}
        <input
          ref={inputRef}
          className={cx(styles.input, { [styles.securePadding]: secure })}
          data-testid="InputField"
          type={!isValueHidden ? 'text' : 'password'}
          autoComplete="false"
          value={value}
          onChange={onChange}
          css={{
            border: '2px solid',
            borderColor: validation?.valid === false ? getColor('infoError') : getColor(borderColor || 'grey.100'),
            color: getColor(textColor, 'black'),
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
            testID="ErrorMessage"
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
