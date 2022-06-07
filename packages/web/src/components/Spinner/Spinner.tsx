/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '@uikit/common';
import cx from 'classnames';

import useTheme from '../../hooks/useTheme';
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
    <div data-testid={testID} className={styles.container} {...props}>
      <div className={styles.spinnerSection}>
        <div className={styles.spinnerContainer}>
          <div className={cx(styles.square, styles.one)}>
            <div data-testid="dot" className={cx(styles.dot, styles.tl)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.tr)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.br)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.bl)} style={{ backgroundColor: fillColor }} />
          </div>
          <div className={cx(styles.square, styles.two)}>
            <div className={cx(styles.dot, styles.t)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.r)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.b)} style={{ backgroundColor: fillColor }} />
            <div className={cx(styles.dot, styles.l)} style={{ backgroundColor: fillColor }} />
          </div>
        </div>
      </div>
      {textContent && (
        <div className={styles.textSection}>
          <Text testID="SpinnerText" type="H4" color={textContentColor}>
            {textContent}
          </Text>
        </div>
      )}
    </div>
  );
};

export default Spinner;
