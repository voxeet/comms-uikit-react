import cx from 'classnames';
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
  icon: Extract<IconComponentName, 'present' | 'record' | 'stream'>;
  avatar?: ReactNode;
  statusDotColor?: ColorKey;
  streamingServiceLogo?: ReactNode;
  compact?: boolean;
};

const Status = ({ label, icon, statusDotColor, avatar, streamingServiceLogo, compact, ...props }: StatusProps) => {
  const { getColor } = useTheme();

  return (
    <Space pv="xxs" className={cx(styles.wrapper)} {...props}>
      {compact ? (
        <Icon name={icon} size="m" />
      ) : (
        <>
          {streamingServiceLogo}
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
        </>
      )}
      <Space />
    </Space>
  );
};

export default Status;
