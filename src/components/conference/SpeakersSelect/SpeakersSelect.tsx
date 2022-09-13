import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useConference from '../../../hooks/useConference';
import useSpeaker from '../../../hooks/useSpeaker';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Dropdown, { type DropdownOptionType } from '../../ui/Dropdown/Dropdown';
import DropdownControl from '../../ui/Dropdown/DropdownControl';
import DropdownLabel from '../../ui/Dropdown/DropdownLabel';
import DropdownList from '../../ui/Dropdown/DropdownList';

type SpeakersSelectProps = {
  labelColor?: ColorKey;
  textColor?: ColorKey;
  backgroundColor?: ColorKey;
  label: string;
  placeholder: string;
  testID?: string;
};

const SpeakersSelect = ({
  labelColor = 'black',
  textColor = 'grey.500',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: SpeakersSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DropdownOptionType | null>(null);
  const [devices, setDevices] = useState<DropdownOptionType[]>([]);
  const { getSpeakers, selectSpeaker, localSpeakers, setLocalSpeakers } = useSpeaker();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const speakerDevices = await getSpeakers();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: speakerDevices,
        local: localSpeakers?.deviceId,
        renderLabel: (label: string) => label,
        icon: 'speaker',
      });
      setDevices(options);
      setSelectedDevice(defaultDevice);
    })();
  }, []);

  const onChange = async (e: DropdownOptionType) => {
    setSelectedDevice(e);
    if (conference) {
      try {
        await selectSpeaker(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    setLocalSpeakers(e.info);
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

export default SpeakersSelect;
