/* eslint-disable react/jsx-props-no-spreading */

import Space from '../Space/Space';
import Text, { TextProps } from '../Text/Text';

import styles from './Select.module.scss';

type SelectLabelProps = {
  label: string;
  testID?: string;
} & Partial<TextProps>;

const SelectLabel = ({ label, testID, ...props }: SelectLabelProps) => {
  return (
    <Space testID={testID} mt="xxs" mb="xs" ml="s" className={styles.label}>
      <Text type="captionSemiBold" {...props}>
        {label}
      </Text>
    </Space>
  );
};

export default SelectLabel;
