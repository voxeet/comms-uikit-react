/* eslint-disable react/jsx-props-no-spreading */
import type { ColorKey } from '../../../../common';
import cx from 'classnames';

import useTheme from '../../../../hooks/useTheme';
import Space from '../../Space/Space';

import styles from './QualityIndicator.module.scss';

type QualityLevel = -1 | 1 | 2 | 3 | 4 | 5;

export type QualityIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  qualityLevel: QualityLevel;
  backgroundColor?: ColorKey;
  activeColor?: ColorKey;
  defaultColor?: ColorKey;
  testID?: string;
};

const QualityIndicator = ({
  qualityLevel,
  backgroundColor,
  activeColor,
  defaultColor,
  testID,
  ...props
}: QualityIndicatorProps) => {
  const { getColor } = useTheme();

  const handleLineFillColor = (level: QualityLevel) => {
    let fill = getColor(activeColor, 'grey.600');
    if (qualityLevel >= level) fill = getColor(defaultColor, 'white');

    return fill;
  };

  return (
    <Space
      p="xxs"
      testID={testID}
      className={cx(styles.quality)}
      style={{ backgroundColor: getColor(backgroundColor, 'whiteAlpha.500') }}
      {...props}
    >
      <Space
        testID="lineFirst"
        className={cx(styles.line, styles.first)}
        style={{ backgroundColor: handleLineFillColor(1) }}
      />
      <Space
        testID="lineSecond"
        className={cx(styles.line, styles.second)}
        style={{ backgroundColor: handleLineFillColor(2) }}
      />
      <Space
        testID="lineThird"
        className={cx(styles.line, styles.third)}
        style={{ backgroundColor: handleLineFillColor(3) }}
      />
      <Space
        testID="lineFourth"
        className={cx(styles.line, styles.fourth)}
        style={{ backgroundColor: handleLineFillColor(4) }}
      />
      <Space
        testID="lineFifth"
        className={cx(styles.line, styles.fifth)}
        style={{ backgroundColor: handleLineFillColor(5) }}
      />
    </Space>
  );
};

export default QualityIndicator;
