import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Icon from '../Icon/Icon';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Dropdown.module.scss';
import useDropdownControl from './useDropdown';

type DropdownControlProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder: string;
  color?: ColorKey;
  borderColor?: ColorKey;
  backgroundColor?: ColorKey;
  testID?: string;
};

const DropdownControl = ({ placeholder, color, backgroundColor, testID, ...props }: DropdownControlProps) => {
  const { isOpen, selected, toggle } = useDropdownControl();
  const { getColor } = useTheme();

  const content = () => {
    if (selected) {
      if (typeof selected.label === 'string') {
        return (
          <Text type="bodySmall" color={getColor(color, 'grey.500')}>
            {selected.label}
          </Text>
        );
      }
      return selected.label;
    }
    return (
      <Text type="bodySmall" color={getColor(color, 'black')}>
        {placeholder}
      </Text>
    );
  };

  return (
    <button
      data-testid={testID}
      type="button"
      className={styles.control}
      css={{
        borderColor: isOpen ? getColor('grey.200') : getColor('grey.100'),
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        color: getColor('grey.500'),
        height: 48,
        paddingRight: 50,
        position: 'relative',
        zIndex: 2,
        backgroundColor: backgroundColor || 'transparent',
      }}
      onClick={toggle}
      {...props}
    >
      {selected && selected.icon && (
        <Space pr="xs">
          <Icon name={selected.icon} color="grey.300" />
        </Space>
      )}
      {content()}
      <div css={{ borderColor: color || getColor('grey.500') }} className={styles.dropdownArrow} />
    </button>
  );
};

export default DropdownControl;
