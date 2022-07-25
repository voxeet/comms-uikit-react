import type { SelectOptionType } from 'src/components/ui/Select/Select';

export type DeviceInfoToOptionsArguments = {
  data: MediaDeviceInfo[];
  local: string | null | undefined;
  renderLabel?(label: string): React.ReactNode;
};

export const deviceInfoToOptions = ({ data, local, renderLabel }: DeviceInfoToOptionsArguments) => {
  let defaultDevice: SelectOptionType | null = null;
  const options: Array<SelectOptionType & { info: MediaDeviceInfo }> = [];
  data.forEach((item) => {
    const option = {
      value: item.deviceId,
      label: renderLabel ? renderLabel(item.label) : item.label,
      info: item,
    };
    options.push(option);
    if (item.deviceId === local || item.deviceId === 'default' || data.length === 1) {
      defaultDevice = option;
    }
  });
  return { options, defaultDevice };
};
