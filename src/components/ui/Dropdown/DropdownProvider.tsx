import { createContext, useMemo, useState } from 'react';

import type { DropdownOptionType } from './Dropdown';

type DropdownContext = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: DropdownOptionType | null;
  setSelected: React.Dispatch<React.SetStateAction<DropdownOptionType | null>>;
};

export const DropdownContext = createContext<DropdownContext>({ isOpen: false } as DropdownContext);

const DropdownProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<DropdownContext['selected']>(null);
  const [isOpen, setIsOpen] = useState(false);

  const contextValue: DropdownContext = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selected,
      setSelected,
    }),
    [isOpen, selected],
  );

  return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
};

export default DropdownProvider;
