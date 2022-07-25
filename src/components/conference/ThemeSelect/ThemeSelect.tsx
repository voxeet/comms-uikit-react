import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useTheme from '../../../hooks/useTheme';
import Select, { type SelectOptionType } from '../../ui/Select/Select';
import SelectControl from '../../ui/Select/SelectControl';
import SelectDropdown from '../../ui/Select/SelectDropdown';
import SelectLabel from '../../ui/Select/SelectLabel';

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
  labelColor = 'black',
  textColor = 'black',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: ThemeSelectProps) => {
  const { availableThemes, activeTheme, setActiveTheme } = useTheme();
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const [activeOption, setActiveOption] = useState<SelectOptionType | null>(null);

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

  const onChange = (option: SelectOptionType) => {
    setActiveTheme(option.value);
  };

  return (
    <Select testID={testID} selected={activeOption}>
      <SelectLabel label={label} color={labelColor} />
      <SelectControl placeholder={placeholder} color={textColor} backgroundColor={backgroundColor} />
      <SelectDropdown onChange={onChange} options={options} color={textColor} backgroundColor={backgroundColor} />
    </Select>
  );
};

export default ThemeSelect;
