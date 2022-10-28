import cx from 'classnames';
import type { DropdownOptionType } from 'src/components/ui/Dropdown/Dropdown';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Icon from '../Icon/Icon';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Dropdown.module.scss';
import type { DropdownListProps } from './DropdownList';

type DropdownOptionProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  isActive: boolean;
  color?: ColorKey;
  iconColor?: ColorKey;
  onChange: DropdownListProps['onChange'];
  testID?: string;
  option: DropdownOptionType;
};

export const DropdownOption = ({
  option,
  isActive,
  color,
  iconColor,
  onChange,
  testID,
  ...props
}: DropdownOptionProps) => {
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
      {option.icon && (
        <Space pr="xs">
          <Icon name={option.icon} color={iconColor || 'grey.300'} />
        </Space>
      )}
      {typeof option.label === 'string' ? (
        <Text type="bodySmall" color={color || getColor('grey.500')}>
          {option.label}
        </Text>
      ) : (
        option.label
      )}
      {isActive && <Icon name="successFilled" color="success.600" />}
    </button>
  );
};
