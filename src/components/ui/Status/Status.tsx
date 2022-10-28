import type { ReactNode, ComponentProps } from 'react';

import useTheme from '../../../hooks/useTheme';
import type { ColorKey } from '../../../theme/types';
import Icon from '../Icon/Icon';
import type { IconComponentName } from '../Icon/IconComponents';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Status.module.scss';

type StatusProps = ComponentProps<typeof Space> & {
  label: string | ReactNode;
  icon: Extract<IconComponentName, 'present' | 'record'>;
  avatar?: ReactNode;
  statusDotColor?: ColorKey;
};

const Status = ({ label, icon, statusDotColor, avatar, ...props }: StatusProps) => {
  const { getColor } = useTheme();

  return (
    <Space pv="xxs" className={styles.wrapper} {...props}>
      {avatar || <Icon name={icon} size="m" />}
      {label && (
        <Space ml="xs">
          <Text className={styles.label}>{label}</Text>
        </Space>
      )}
      {statusDotColor && (
        <Space
          testID="StatusDot"
          style={{ backgroundColor: getColor(statusDotColor) }}
          className={styles.statusDot}
          m="xxs"
        />
      )}
      <Space />
    </Space>
  );
};

export default Status;
