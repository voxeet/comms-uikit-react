import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useConference from '../../../hooks/useConference';
import useSpeaker from '../../../hooks/useSpeaker';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Icon from '../../ui/Icon/Icon';
import Select, { type SelectOptionType } from '../../ui/Select/Select';
import SelectControl from '../../ui/Select/SelectControl';
import SelectDropdown from '../../ui/Select/SelectDropdown';
import SelectLabel from '../../ui/Select/SelectLabel';
import styles from '../../ui/Select/SelectOption.module.scss';

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
  textColor = 'black',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: SpeakersSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<SelectOptionType | null>(null);
  const [devices, setDevices] = useState<SelectOptionType[]>([]);
  const { getSpeakers, selectSpeaker, localSpeakers, setLocalSpeakers } = useSpeaker();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const speakerDevices = await getSpeakers();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: speakerDevices,
        local: localSpeakers?.deviceId,
        renderLabel: (label: string) => (
          <div className={styles.option}>
            <Icon name="speaker" color="black" />
            <span>{label}</span>
          </div>
        ),
      });
      setDevices(options);
      setSelectedDevice(defaultDevice);
    })();
  }, []);

  const onChange = async (e: SelectOptionType) => {
    setSelectedDevice(e);
    if (conference) {
      try {
        await selectSpeaker(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    // @ts-expect-error deviceInfoOptions includes e.info
    setLocalSpeakers(e.info);
  };

  if (devices.length === 0) {
    return null;
  }
  return (
    <Select testID={testID} selected={selectedDevice}>
      <SelectLabel label={label} color={labelColor} />
      <SelectControl placeholder={placeholder} color={textColor} backgroundColor={backgroundColor} />
      <SelectDropdown onChange={onChange} options={devices} color={textColor} backgroundColor={backgroundColor} />
    </Select>
  );
};

export default SpeakersSelect;
