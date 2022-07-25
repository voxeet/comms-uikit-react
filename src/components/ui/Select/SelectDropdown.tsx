/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';

import useTheme from '../../../hooks/useTheme';
import Space from '../Space/Space';

import type { SelectOptionType } from './Select';
import styles from './Select.module.scss';
import { SelectOption } from './SelectOption';
import useSelect from './useSelect';

export type SelectDropdownProps = {
  backgroundColor?: ColorKey;
  color?: ColorKey;
  options: SelectOptionType[];
  onChange: (value: SelectOptionType) => void;
  testID?: string;
};

const SelectDropdown = ({ backgroundColor, color, options, onChange, testID }: SelectDropdownProps) => {
  const { isOpen, setIsOpen, selected } = useSelect();
  const { getColor } = useTheme();
  const handleOnChange = (item: SelectOptionType) => {
    onChange(item);
    setIsOpen(false);
  };
  if (isOpen) {
    return (
      <Space
        testID={testID}
        className={styles.dropdown}
        css={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          boxShadow: '0px 4px 8px rgba(97, 97, 97, 0.18)',
          overflow: 'hidden',
          paddingTop: 48,
          position: 'absolute',
          top: 27,
          left: 0,
          right: 0,
          zIndex: 3,
        }}
        style={{ backgroundColor: getColor(backgroundColor, 'white') }}
      >
        <Space className={styles.dropdownContent}>
          {options.map((option) => (
            <SelectOption
              isActive={selected?.value === option.value}
              option={option}
              key={option.value}
              onChange={handleOnChange}
              color={color}
            />
          ))}
        </Space>
      </Space>
    );
  }
  return null;
};

export default SelectDropdown;
