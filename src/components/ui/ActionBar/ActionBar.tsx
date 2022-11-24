import cx from 'classnames';
import { useEffect } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import useTheme from '../../../hooks/useTheme';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import Space from '../Space/Space';
import Text from '../Text/Text';
import Tooltip from '../Tooltip/Tooltip';

import styles from './ActionBar.module.scss';

export type ActionButtonLabels = { label: string; tooltip?: string };
export type ActionButtonConfig = ActionButtonLabels & { callback: () => void };

type ActionBarProps = ComponentProps<typeof Space> & {
  actionButtonConfig?: ActionButtonConfig;
  closeCallback?: () => void;
  unified?: boolean;
  compact?: boolean;
  onMount?: () => void;
};

export type AbstractionBarPropsBase<T, K> = {
  onMount?: () => void;
  onActionSuccess?: () => void;
  statusLabels: Record<keyof K, string | ReactNode>;
  buttonLabels: T;
  guestLabel?: string | ReactNode;
  compact?: boolean;
  testID?: string;
} & ComponentProps<typeof Space>;

const ActionBar = ({
  children,
  actionButtonConfig,
  closeCallback,
  unified = false,
  compact = false,
  onMount,
  ...props
}: ActionBarProps) => {
  const { getColor, isDesktop } = useTheme();

  useEffect(() => {
    onMount?.();
  }, []);

  return (
    <Space
      testID="StatusActionBar"
      className={cx(styles.wrapper, compact ? styles.compact : styles.fullWidth, {
        [styles.mobile]: !isDesktop && !unified,
        [styles.clickable]: !!props.onClick,
        [styles.compactAlignment]: !isDesktop,
      })}
      style={{ backgroundColor: getColor('grey.800') }}
      pv="xs"
      ph={isDesktop ? 'm' : 's'}
      {...props}
    >
      {children}
      {actionButtonConfig && (
        <Space className={styles.row}>
          <Tooltip text={actionButtonConfig.tooltip || ''} position="bottom">
            <Button
              testID="ActionBarButton"
              style={{ height: 32 }}
              onClick={actionButtonConfig.callback}
              className={cx(!isDesktop && styles.mobileButton)}
            >
              <Text type="captionSmallDemiBold">{actionButtonConfig.label}</Text>
            </Button>
          </Tooltip>
          {closeCallback && (
            <Space pl="xs">
              <IconButton size="xs" icon="close" onClick={closeCallback} testID="ActionBarClose" />
            </Space>
          )}
        </Space>
      )}
    </Space>
  );
};

export default ActionBar;
