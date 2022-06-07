import { useContext } from 'react';

import { SelectContext } from './SelectProvider';

const useSelect = () => {
  const { isOpen, setIsOpen, selected, setSelected } = useContext(SelectContext);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, setIsOpen, toggle, selected, setSelected };
};

export default useSelect;
