import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../Space/Space';

import type { DropdownOptionType } from './Dropdown';
import styles from './Dropdown.module.scss';
import { DropdownOption } from './DropdownOption';
import useDropdown from './useDropdown';

export type DropdownListProps = {
  backgroundColor?: ColorKey;
  color?: ColorKey;
  options: DropdownOptionType[];
  onChange: (value: DropdownOptionType) => void;
  testID?: string;
};

const DropdownList = ({ backgroundColor, color, options, onChange, testID }: DropdownListProps) => {
  const { isOpen, setIsOpen, selected } = useDropdown();
  const { getColor } = useTheme();
  const handleOnChange = (item: DropdownOptionType) => {
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
            <DropdownOption
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

export default DropdownList;
