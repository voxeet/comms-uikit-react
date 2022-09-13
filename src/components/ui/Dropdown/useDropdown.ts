import { useContext } from 'react';

import { DropdownContext } from './DropdownProvider';

const useDropdown = () => {
  const { isOpen, setIsOpen, selected, setSelected } = useContext(DropdownContext);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, setIsOpen, toggle, selected, setSelected };
};

export default useDropdown;
