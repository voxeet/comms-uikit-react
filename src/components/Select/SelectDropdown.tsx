/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../common';

import useTheme from '../../hooks/useTheme';

import type { SelectOptionType } from './Select';
import styles from './Select.module.scss';
import { SelectOption } from './SelectOption';
import useSelect from './useSelect';

export type SelectDropdownProps = {
  backgroundColor?: ColorKey;
  color?: ColorKey;
  options: SelectOptionType[];
  onChange: (value: SelectOptionType) => void;
};

const SelectDropdown = ({ backgroundColor, color, options, onChange }: SelectDropdownProps) => {
  const { isOpen, setIsOpen, selected } = useSelect();
  const { getColor } = useTheme();
  const handleOnChange = (item: SelectOptionType) => {
    onChange(item);
    setIsOpen(false);
  };
  if (isOpen) {
    return (
      <div className={styles.dropdown} style={{ backgroundColor: getColor(backgroundColor, 'white') }}>
        <div className={styles.dropdownContent}>
          {options.map((option) => (
            <SelectOption
              isActive={selected?.value === option.value}
              option={option}
              key={option.value}
              onChange={handleOnChange}
              color={color}
              backgroundColor={backgroundColor}
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default SelectDropdown;
