import { useEffect, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Dropdown, { type DropdownOptionType } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

import { ThemeOption } from './ThemeOption';

type ThemeSelectProps = {
  labelColor?: ColorKey;
  textColor?: ColorKey;
  backgroundColor?: ColorKey;
  label: string;
  placeholder: string;
  testID?: string;
};

const ThemeSelect = ({
  labelColor = 'grey.500',
  textColor = 'grey.500',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: ThemeSelectProps) => {
  const { availableThemes, activeTheme, setActiveTheme } = useTheme();
  const [options, setOptions] = useState<DropdownOptionType[]>([]);
  const [activeOption, setActiveOption] = useState<DropdownOptionType | null>(null);

  useEffect(() => {
    setOptions(() => {
      return availableThemes.map((value) => ({
        value,
        label: <ThemeOption value={value} />,
      }));
    });
  }, []);

  useEffect(() => {
    setActiveOption(() => ({
      value: activeTheme,
      label: <ThemeOption value={activeTheme} />,
    }));
  }, [activeTheme]);

  const onChange = (option: DropdownOptionType) => {
    setActiveTheme(option.value);
  };

  return (
    <Dropdown testID={testID} selected={activeOption}>
      <DropdownLabel label={label} color={labelColor} />
      <DropdownControl placeholder={placeholder} color={textColor} backgroundColor={backgroundColor} />
      <DropdownList onChange={onChange} options={options} color={textColor} backgroundColor={backgroundColor} />
    </Dropdown>
  );
};

export default ThemeSelect;
