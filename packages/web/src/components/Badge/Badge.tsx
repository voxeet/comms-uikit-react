/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '@uikit/common';
import cx from 'classnames';

import useTheme from '../../hooks/useTheme';
import Text from '../Text/Text';

import styles from './Badge.module.scss';

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  content?: React.ReactNode;
  backgroundColor?: ColorKey;
  contentColor?: ColorKey;
  testID?: string;
};

const Badge = ({ content, backgroundColor = 'grey.700', contentColor = 'white', testID, ...props }: BadgeProps) => {
  const { getColor } = useTheme();
  return (
    <div
      data-testid={testID}
      className={cx(styles.badge, !content && styles.noContent)}
      style={{ backgroundColor: getColor(backgroundColor) }}
      {...props}
    >
      {content && (
        <Text type="captionSemiBold" align="center" color={contentColor}>
          {content}
        </Text>
      )}
    </div>
  );
};

export default Badge;
