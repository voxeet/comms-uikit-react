import { useContext } from 'react';

import { ThemeContext } from '../providers/ThemeProvider';

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme hook must be used within a ThemeProvider');
  }
  return context;
};

export default useThemeContext;
