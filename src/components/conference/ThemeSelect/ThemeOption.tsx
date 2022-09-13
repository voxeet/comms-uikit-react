import useTheme from '../../../hooks/useTheme';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';

import styles from './Theme.module.scss';

type ThemeOptionProps = {
  value: string;
};

export const ThemeOption = ({ value }: ThemeOptionProps) => {
  const { themes } = useTheme();
  return (
    <Space testID="ThemeOption" className={styles.option}>
      <Space
        mr="xs"
        className={styles.dot}
        style={{
          background: `linear-gradient(90deg, ${themes?.[value]?.colors?.primary?.[400] || 'black'} 50%, ${
            themes?.[value]?.colors?.secondary?.[400] || 'gray'
          } 50%)`,
        }}
      />
      <Text color="gray.500">{value}</Text>
    </Space>
  );
};
