import type { DropdownOptionType } from '../components/ui/Dropdown/Dropdown';
import type { IconComponentName } from '../components/ui/Icon/IconComponents';

export type DeviceInfoToOptionsArguments = {
  data: MediaDeviceInfo[];
  local: string | null | undefined;
  renderLabel?(label: string): React.ReactNode;
  icon?: IconComponentName;
  defaultDeviceLabel?: string;
};

export const deviceInfoToOptions = ({
  data,
  local,
  renderLabel,
  icon,
  defaultDeviceLabel = '',
}: DeviceInfoToOptionsArguments) => {
  let defaultDevice: DropdownOptionType | null = null;
  const options: Array<DropdownOptionType & { info: MediaDeviceInfo }> = [];
  data.forEach((item) => {
    const label = item.label.length ? item.label : defaultDeviceLabel;
    const option = {
      value: item.deviceId,
      label: renderLabel ? renderLabel(label) : label,
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
