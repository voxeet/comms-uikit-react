/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import { useEffect, useRef } from 'react';

import Space from '../Space/Space';

import styles from './Select.module.scss';
import SelectProvider from './SelectProvider';
import { useClickOutside } from './useClickOutside';
import useSelect from './useSelect';

export type SelectOptionType = React.HTMLAttributes<HTMLDivElement> & {
  label: string | React.ReactNode;
  value: string;
};

export type SelectProps = {
  selected: SelectOptionType | null;
  children: React.ReactNode;
  testID?: string;
};

const SelectContent = ({ testID, selected, children, ...props }: SelectProps) => {
  const { isOpen, setIsOpen, setSelected } = useSelect();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <Space testID={testID} className={styles.uiSelect} {...props}>
      <div ref={dropdownRef} className={cx(styles.wrapper, { [styles.isOpen]: isOpen })}>
        {children}
      </div>
    </Space>
  );
};

const Select = ({ selected, children, testID }: SelectProps) => {
  return (
    <SelectProvider>
      <SelectContent testID={testID} selected={selected}>
        {children}
      </SelectContent>
    </SelectProvider>
  );
};

export default Select;
