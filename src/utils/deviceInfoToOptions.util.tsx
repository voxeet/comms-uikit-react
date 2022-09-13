import type { DropdownOptionType } from 'src/components/ui/Dropdown/Dropdown';

import type { IconComponentName } from '../components/ui/Icon/IconComponents';

export type DeviceInfoToOptionsArguments = {
  data: MediaDeviceInfo[];
  local: string | null | undefined;
  renderLabel?(label: string): React.ReactNode;
  icon?: IconComponentName;
};

export const deviceInfoToOptions = ({ data, local, renderLabel, icon }: DeviceInfoToOptionsArguments) => {
  let defaultDevice: DropdownOptionType | null = null;
  const options: Array<DropdownOptionType & { info: MediaDeviceInfo }> = [];
  data.forEach((item) => {
    const option = {
      value: item.deviceId,
      label: renderLabel ? renderLabel(item.label) : item.label,
      info: item,
      icon,
    };
    options.push(option);
    if (item.deviceId === local || item.deviceId === 'default' || data.length === 1) {
      defaultDevice = option;
    }
  });
  return { options, defaultDevice };
};
