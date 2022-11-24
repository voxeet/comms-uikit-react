import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';

import styles from './Theme.module.scss';

type ThemeOptionProps = {
  value: string;
  color?: ColorKey;
};

export const ThemeOption = ({ value, color = 'grey.500' }: ThemeOptionProps) => {
  const { themes } = useTheme();
  return (
    <Space testID="ThemeOption" className={styles.option}>
      <Space>
        <Space
          mr="xs"
          className={styles.dot}
          style={{
            background: `linear-gradient(90deg, ${themes?.[value]?.colors?.primary?.[400] || 'black'} 50%, ${
              themes?.[value]?.colors?.secondary?.[400] || 'gray'
            } 50%)`,
          }}
        />
      </Space>
      <Text color={color}>{value}</Text>
    </Space>
  );
};
