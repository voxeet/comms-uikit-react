/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../common';
import cx from 'classnames';

import useTheme from '../../hooks/useTheme';
import Text from '../Text/Text';

import type { SelectOptionType } from './Select';
import styles from './Select.module.scss';
import type { SelectDropdownProps } from './SelectDropdown';

type SelectOptionProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  option: SelectOptionType;
  isActive: boolean;
  backgroundColor?: ColorKey;
  color?: ColorKey;
  onChange: SelectDropdownProps['onChange'];
};

export const SelectOption = ({ option, isActive, backgroundColor, color, onChange, ...props }: SelectOptionProps) => {
  const { getColor } = useTheme();
  return (
    <button
      type="button"
      className={cx(styles.option, { isActive })}
      style={{ backgroundColor: getColor(backgroundColor, 'white') }}
      onClick={() => onChange(option)}
      {...props}
    >
      {typeof option.label === 'string' ? (
        <Text type="buttonDefault" color={color || 'black'}>
          {option.label}
        </Text>
      ) : (
        option.label
      )}
    </button>
  );
};
