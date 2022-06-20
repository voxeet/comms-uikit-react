/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import { useEffect, useRef } from 'react';

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
};

const SelectContent = ({ selected, children, ...props }: SelectProps) => {
  const { isOpen, setIsOpen, setSelected } = useSelect();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <div className={styles.uiSelect} {...props}>
      <div ref={dropdownRef} className={cx(styles.wrapper, { [styles.isOpen]: isOpen })}>
        {children}
      </div>
    </div>
  );
};

const Select = ({ selected, children }: SelectProps) => {
  return (
    <SelectProvider>
      <SelectContent selected={selected}>{children}</SelectContent>
    </SelectProvider>
  );
};

export default Select;
