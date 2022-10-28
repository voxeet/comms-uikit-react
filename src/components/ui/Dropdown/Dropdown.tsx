/* eslint-disable react/no-unused-prop-types */
import cx from 'classnames';
import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';

import type { IconComponentName } from '../Icon/IconComponents';
import Space from '../Space/Space';

import styles from './Dropdown.module.scss';
import DropdownProvider from './DropdownProvider';
import { useClickOutside } from './useClickOutside';
import useDropdown from './useDropdown';

export type DropdownOptionType<T = unknown> = HTMLAttributes<HTMLDivElement> & {
  label: string | ReactNode;
  value: string;
  icon?: IconComponentName;
  info?: T;
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
