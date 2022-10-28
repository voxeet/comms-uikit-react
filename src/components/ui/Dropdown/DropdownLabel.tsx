import Space from '../Space/Space';
import Text, { TextProps } from '../Text/Text';

import styles from './Dropdown.module.scss';

type DropdownLabelProps = {
  label: string;
  testID?: string;
} & Partial<TextProps>;

const DropdownLabel = ({ label, testID, ...props }: DropdownLabelProps) => {
  return (
    <Space testID={testID} mt="xxs" mb="xs" ml="s" className={styles.label}>
      <Text type="captionSemiBold" {...props}>
        {label}
      </Text>
    </Space>
  );
};

export default DropdownLabel;
