/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import Text from '../Text/Text';

import type { SelectOptionType } from './Select';
import styles from './Select.module.scss';
import type { SelectDropdownProps } from './SelectDropdown';

type SelectOptionProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  option: SelectOptionType;
  isActive: boolean;
  color?: ColorKey;
  onChange: SelectDropdownProps['onChange'];
  testID?: string;
};

export const SelectOption = ({ option, isActive, color, onChange, testID, ...props }: SelectOptionProps) => {
  const { getColor } = useTheme();
  return (
    <button
      data-testid={testID}
      type="button"
      className={cx(styles.option, { isActive })}
      css={{
        border: 'none',
        height: 48,
        '&:hover': {
          backgroundColor: getColor('grey.50'),
        },
      }}
      onClick={() => onChange(option)}
      {...props}
    >
      {typeof option.label === 'string' ? (
        <Text type="bodySmall" color={color || getColor('grey.500')}>
          {option.label}
        </Text>
      ) : (
        option.label
      )}
    </button>
  );
};
