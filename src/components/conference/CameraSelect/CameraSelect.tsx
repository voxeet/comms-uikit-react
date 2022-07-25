import type { ColorKey } from '../../../common';
import { useEffect, useState } from 'react';

import useCamera from '../../../hooks/useCamera';
import useConference from '../../../hooks/useConference';
import { deviceInfoToOptions } from '../../../utils/deviceInfoToOptions.util';
import { throwErrorMessage } from '../../../utils/throwError.util';
import Icon from '../../ui/Icon/Icon';
import Select, { type SelectOptionType } from '../../ui/Select/Select';
import SelectControl from '../../ui/Select/SelectControl';
import SelectDropdown from '../../ui/Select/SelectDropdown';
import SelectLabel from '../../ui/Select/SelectLabel';
import styles from '../../ui/Select/SelectOption.module.scss';
import Space from '../../ui/Space/Space';

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
  textColor = 'black',
  backgroundColor = 'white',
  label,
  placeholder,
  testID,
}: CameraSelectProps) => {
  const [selectedDevice, setSelectedDevice] = useState<SelectOptionType | null>(null);
  const [devices, setDevices] = useState<SelectOptionType[]>([]);
  const { getCameras, selectCamera, localCamera, setLocalCamera } = useCamera();
  const { conference } = useConference();

  useEffect(() => {
    (async () => {
      const cameraDevices = await getCameras();
      const { options, defaultDevice } = deviceInfoToOptions({
        data: cameraDevices,
        local: localCamera?.deviceId,
        renderLabel: (label: string) => (
          <Space className={styles.option}>
            <Icon name="camera" color="black" />
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
        await selectCamera(e.value);
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    // @ts-expect-error deviceInfoOptions includes e.info
    setLocalCamera(e.info);
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

export default CameraSelect;
