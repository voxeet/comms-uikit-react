/* eslint-disable react/no-unused-prop-types */
import cx from 'classnames';
import { useEffect, useRef, type ReactNode, type HTMLAttributes, type ComponentProps } from 'react';

import type { ColorKey } from '../../../theme/types';
import type { IconComponentName } from '../Icon/IconComponents';
import Space, { SpaceProps } from '../Space/Space';

import styles from './Dropdown.module.scss';
import DropdownProvider from './DropdownProvider';
import { useClickOutside } from './useClickOutside';
import useDropdown from './useDropdown';

export type SelectPropsBase = {
  labelColor?: ColorKey;
  textColor?: ColorKey;
  backgroundColor?: ColorKey;
  iconColor?: ColorKey;
  hoverColor?: ColorKey;
  primaryBorderColor?: ColorKey;
  secondaryBorderColor?: ColorKey;
  label: string;
  placeholder: string;
  containerProps?: SpaceProps;
  testID?: string;
};

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
  containerProps?: ComponentProps<typeof Space>;
};

const DropdownContent = ({ testID, selected, children, containerProps }: DropdownProps) => {
  const { isOpen, setIsOpen, setSelected } = useDropdown();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <Space testID={testID} className={styles.uiDropdown} {...containerProps}>
      <div ref={dropdownRef} className={cx(styles.wrapper, { [styles.isOpen]: isOpen })}>
        {children}
      </div>
    </Space>
  );
};

const Dropdown = ({ selected, children, testID, ...props }: DropdownProps) => {
  return (
    <DropdownProvider>
      <DropdownContent testID={testID} selected={selected} {...props}>
        {children}
      </DropdownContent>
    </DropdownProvider>
  );
};

export default Dropdown;
