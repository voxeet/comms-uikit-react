import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useConference from '../../../hooks/useConference';
import useMicrophone from '../../../hooks/useMicrophone';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Icon from '../../ui/Icon/Icon';
import Select, { type SelectOptionType } from '../../ui/Select/Select';
import SelectControl from '../../ui/Select/SelectControl';
import SelectDropdown from '../../ui/Select/SelectDropdown';
import SelectLabel from '../../ui/Select/SelectLabel';
import styles from '../../ui/Select/SelectOption.module.scss';
import Space from '../../ui/Space/Space';

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
  textColor = 'black',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: MicrophoneSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<SelectOptionType | null>(null);
  const [devices, setDevices] = useState<SelectOptionType[]>([]);
  const { getMicrophones, selectMicrophone, localMicrophone, setLocalMicrophone } = useMicrophone();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const audioDevices = await getMicrophones();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: audioDevices,
        local: localMicrophone?.deviceId,
        renderLabel: (label: string) => (
          <Space className={styles.option}>
            <Icon name="microphone" color="black" />
            <Space tag="span">{label}</Space>
          </Space>
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
        await selectMicrophone(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    // @ts-expect-error deviceInfoOptions includes e.info
    setLocalMicrophone(e.info);
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

export default MicrophoneSelect;
