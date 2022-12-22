import { useEffect, useState } from 'react';

import useConference from '../../../hooks/useConference';
import useMicrophone from '../../../hooks/useMicrophone';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Dropdown, { type SelectPropsBase } from '../../ui/Dropdown/Dropdown';
import type { DropdownOptionType } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

type MicrophoneSelectProps = SelectPropsBase;

const MicrophoneSelect = ({
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
    setLocalMicrophone(e.info as MediaDeviceInfo);
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

export default MicrophoneSelect;
