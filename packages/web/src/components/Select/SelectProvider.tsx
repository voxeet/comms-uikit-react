import { createContext, useMemo, useState } from 'react';

import type { SelectOptionType } from './Select';

type SelectContext = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: SelectOptionType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectOptionType | null>>;
};

export const SelectContext = createContext<SelectContext>({ isOpen: false } as SelectContext);

const SelectProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<SelectContext['selected']>(null);
  const [isOpen, setIsOpen] = useState(false);

  const contextValue: SelectContext = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selected,
      setSelected,
    }),
    [isOpen, selected],
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
};

export default SelectProvider;
