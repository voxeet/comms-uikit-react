import type { ColorKey, IconsKeys } from '../../../common';
import { useState, useEffect } from 'react';

import Icon from '../../ui/Icon/Icon';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';
import Toast from '../../ui/Toast/Toast';

import styles from './DeviceInfo.module.scss';

type DeviceInfoProps = {
  icon?: IconsKeys;
  iconColor?: ColorKey;
  textColor?: ColorKey;
  device?: string;
  testID?: string;
};

const DeviceInfo = ({ icon, iconColor = 'white', textColor = 'white', device, testID }: DeviceInfoProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!(device && device.length > 0));
    const visibilityTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [device]);

  return (
    <Toast testID={testID} isVisible={isVisible}>
      <Space fw className={styles.content}>
        {icon && (
          <Space className={styles.iconSection}>
            <Icon testID="ToastIcon" name={icon} size="m" color={iconColor} />
          </Space>
        )}
        <Space ml="xs" className={styles.textSection}>
          <Text testID={`${testID}Text`} color={textColor} type="captionSemiBold">
            {device}
          </Text>
        </Space>
      </Space>
    </Toast>
  );
};

export default DeviceInfo;
