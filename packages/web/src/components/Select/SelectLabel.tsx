/* eslint-disable react/jsx-props-no-spreading */

import Text, { TextProps } from '../Text/Text';

import styles from './Select.module.scss';

type SelectLabelProps = {
  label: string;
} & Partial<TextProps>;

const SelectLabel = ({ label, ...props }: SelectLabelProps) => {
  return (
    <div className={styles.label}>
      <Text type="captionRegular" {...props}>
        {label}
      </Text>
    </div>
  );
};

export default SelectLabel;
