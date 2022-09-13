import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useConference from '../../../hooks/useConference';
import useMicrophone from '../../../hooks/useMicrophone';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Dropdown from '../../ui/Dropdown/Dropdown';
import type { DropdownOptionType } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

type MicrophoneSelectProps = {
  labelColor?: ColorKey;
  textColor?: ColorKey;
  backgroundColor?: ColorKey;
  label: string;
  placeholder: string;
  testID?: string;
};

const MicrophoneSelect = ({
  labelColor = 'black',
  textColor = 'grey.500',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: MicrophoneSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DropdownOptionType | null>(null);
  const [devices, setDevices] = useState<DropdownOptionType[]>([]);
  const { getMicrophones, selectMicrophone, localMicrophone, setLocalMicrophone } = useMicrophone();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const audioDevices = await getMicrophones();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: audioDevices,
        local: localMicrophone?.deviceId,
        renderLabel: (label: string) => label,
        icon: 'microphone',
      });
      setDevices(options);
      setSelectedDevice(defaultDevice);
    })();
  }, []);

  const onChange = async (e: DropdownOptionType) => {
    setSelectedDevice(e);
    if (conference) {
      try {
        await selectMicrophone(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    setLocalMicrophone(e.info);
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

export default MicrophoneSelect;
