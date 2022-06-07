/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '@uikit/common';

import useTheme from '../../hooks/useTheme';
import Text from '../Text/Text';

import styles from './Select.module.scss';
import useSelect from './useSelect';

type SelectControlProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder: string;
  color?: ColorKey;
  borderColor?: ColorKey;
};

const SelectControl = ({ placeholder, color, borderColor, ...props }: SelectControlProps) => {
  const { selected, toggle } = useSelect();
  const { getColor } = useTheme();
  const content = () => {
    if (selected) {
      if (typeof selected.label === 'string') {
        return (
          <Text type="buttonDefault" color={getColor(color, 'black')}>
            {selected.label}
          </Text>
        );
      }
      return selected.label;
    }
    return (
      <Text type="buttonDefault" color={getColor(color, 'black')}>
        {placeholder}
      </Text>
    );
  };

  return (
    <button
      type="button"
      className={styles.control}
      style={{ borderColor: getColor(borderColor, 'grey.500') }}
      onClick={toggle}
      {...props}
    >
      {content()}
      <div className={styles.dropdownArrow} style={{ borderColor: getColor(borderColor, 'grey.500') }} />
    </button>
  );
};

export default SelectControl;
