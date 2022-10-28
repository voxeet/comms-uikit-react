import { useEffect, useState } from 'react';

import useCamera from '../../../hooks/useCamera';
import useConference from '../../../hooks/useConference';
import type { ColorKey } from '../../../theme/types';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Dropdown, { type DropdownOptionType } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

type CameraSelectProps = {
  labelColor?: ColorKey;
  textColor?: ColorKey;
  backgroundColor?: ColorKey;
  label: string;
  placeholder: string;
  testID?: string;
};

const CameraSelect = ({
  labelColor = 'black',
  textColor = 'grey.500',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: CameraSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DropdownOptionType | null>(null);
  const [devices, setDevices] = useState<DropdownOptionType[]>([]);
  const { getCameras, selectCamera, localCamera, setLocalCamera } = useCamera();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const cameraDevices = await getCameras();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: cameraDevices,
        local: localCamera?.deviceId,
        renderLabel: (label: string) => label,
        icon: 'camera',
      });
      setDevices(options);
      setSelectedDevice(defaultDevice);
    })();
  }, []);

  const onChange = async (e: DropdownOptionType) => {
    setSelectedDevice(e);
    if (conference) {
      try {
        await selectCamera(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    setLocalCamera(e.info as MediaDeviceInfo);
  };

  if (devices.length === 0) {
    return null;
  }
  return (
    <Dropdown testID={testID} selected={selectedDevice}>
      <DropdownLabel label={label} color={labelColor} />
      <DropdownControl placeholder={placeholder} color={textColor} backgroundColor={backgroundColor} />
      <DropdownList onChange={onChange} options={devices} color={textColor} backgroundColor={backgroundColor} />
    </Dropdown>
  );
};

export default CameraSelect;
