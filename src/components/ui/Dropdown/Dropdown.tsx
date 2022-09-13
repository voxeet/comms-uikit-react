/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import cx from 'classnames';
import { useEffect, useRef } from 'react';

import type { IconComponentName } from '../Icon/IconComponents';
import Space from '../Space/Space';

import styles from './Dropdown.module.scss';
import DropdownProvider from './DropdownProvider';
import { useClickOutside } from './useClickOutside';
import useDropdown from './useDropdown';

export type DropdownOptionType = React.HTMLAttributes<HTMLDivElement> & {
  label: string | React.ReactNode;
  value: string;
  icon?: IconComponentName;
  info?: any;
};

export type DropdownProps = {
  selected: DropdownOptionType | null;
  children: React.ReactNode;
  testID?: string;
};

const DropdownContent = ({ testID, selected, children, ...props }: DropdownProps) => {
  const { isOpen, setIsOpen, setSelected } = useDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <Space testID={testID} className={styles.uiDropdown} {...props}>
      <div ref={dropdownRef} className={cx(styles.wrapper, { [styles.isOpen]: isOpen })}>
        {children}
      </div>
    </Space>
  );
};

const Dropdown = ({ selected, children, testID }: DropdownProps) => {
  return (
    <DropdownProvider>
      <DropdownContent testID={testID} selected={selected}>
        {children}
      </DropdownContent>
    </DropdownProvider>
  );
};

export default Dropdown;
