/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../common';
import cx from 'classnames';

import useTheme from '../../../hooks/useTheme';
import Space from '../Space/Space';
import Text from '../Text/Text';

import styles from './Spinner.module.scss';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  spinnerColor?: ColorKey;
  textContent?: string | number;
  textContentColor?: ColorKey;
  testID?: string;
};

const Spinner = ({
  spinnerColor = 'primary.500',
  textContent,
  textContentColor = 'grey.100',
  testID,
  ...props
}: SpinnerProps) => {
  const { getColor } = useTheme();

  const fillColor = getColor(spinnerColor);

  return (
    <Space testID={testID} className={styles.container} {...props}>
      <Space className={styles.spinnerSection}>
        <Space className={styles.spinnerContainer}>
          <Space className={cx(styles.square, styles.one)}>
            <Space testID="dot" className={cx(styles.dot, styles.tl)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.tr)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.br)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.bl)} style={{ backgroundColor: fillColor }} />
          </Space>
          <Space className={cx(styles.square, styles.two)}>
            <Space className={cx(styles.dot, styles.t)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.r)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.b)} style={{ backgroundColor: fillColor }} />
            <Space className={cx(styles.dot, styles.l)} style={{ backgroundColor: fillColor }} />
          </Space>
        </Space>
      </Space>
      {textContent && (
        <Space pt="m" className={styles.textSection}>
          <Text testID="SpinnerText" type="H4" color={textContentColor}>
            {textContent}
          </Text>
        </Space>
      )}
    </Space>
  );
};

export default Spinner;
