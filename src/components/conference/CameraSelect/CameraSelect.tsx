import { useEffect, useState } from 'react';

import useCamera from '../../../hooks/useCamera';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Dropdown, { type DropdownOptionType, type SelectPropsBase } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

type CameraSelectProps = SelectPropsBase;

const CameraSelect = ({
  labelColor = 'grey.500',
  textColor = 'grey.500',
  backgroundColor = 'white',
  iconColor = 'grey.300',
  hoverColor = 'grey.50',
  primaryBorderColor = 'grey.100',
  secondaryBorderColor = 'grey.200',
  label,
  placeholder,
  testID,
  ...props
}: CameraSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DropdownOptionType | null>(null);
  const [devices, setDevices] = useState<DropdownOptionType[]>([]);
  const { cameras, getCameras, selectCamera, localCamera, setLocalCamera } = useCamera();

  useEffect(() => {
    getCameras();
  }, []);

  useEffect(() => {
    (async () => {
      let defaultConfDevice;
      const { options, defaultDevice } = deviceInfoToOptions({
        data: cameras,
        local: localCamera?.deviceId,
        renderLabel: (label: string) => label,
        icon: 'camera',
      });
      setDevices(options);

      if (localCamera) {
        const device = options.find((o) => o.value === localCamera.deviceId);
        if (device) {
          defaultConfDevice = device;
        }
      }
      setSelectedDevice(defaultConfDevice || defaultDevice);
    })();
  }, [cameras]);

  const onChange = async (e: DropdownOptionType) => {
    if (e.value === selectedDevice?.value) return;
    setSelectedDevice(e);
    try {
      await selectCamera(e.value);
    } catch (error) {
      throwErrorMessage(error);
    }
    setLocalCamera(e.info as MediaDeviceInfo);
  };

  if (devices.length === 0) {
    return null;
  }
  return (
    <Dropdown testID={testID} selected={selectedDevice} {...props}>
      <DropdownLabel label={label} color={labelColor} />
      <DropdownControl
        placeholder={placeholder}
        color={textColor}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        primaryBorderColor={primaryBorderColor}
        secondaryBorderColor={secondaryBorderColor}
      />
      <DropdownList
        onChange={onChange}
        options={devices}
        color={textColor}
        iconColor={iconColor}
        backgroundColor={backgroundColor}
        hoverColor={hoverColor}
      />
    </Dropdown>
  );
};

export default CameraSelect;
